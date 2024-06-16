import {
    List,
    Table,
    Card,
    InputNumber,
    Button,
    ConfigProvider,
    Empty,
} from 'antd'
import type { TableColumnType, TableProps } from 'antd'
import StatusTag from './StatusTag'
import Contact from './Contact'

import { GetLeadsQuery, Lead, getLeads } from '../../services/LeadsService'
import { formatCurrency, formatTime } from '../../helpers/formatters'

import { useEffect, useState } from 'react'
import styles from './LeadsTable.module.css'
import { ExpandableConfig } from 'antd/es/table/interface'

export default function App() {
    const [leads, setLeads] = useState<Lead[]>()
    const [isLoading, setIsLoading] = useState(false)

    const getLeadsHttp = (query?: GetLeadsQuery) => {
        setIsLoading(true)
        getLeads(query)
            .then(setLeads)
            .finally(() => setIsLoading(false))
    }

    const priceColumn: TableColumnType<Lead> = {
        title: 'Бюджет',
        dataIndex: 'price',
        render: (price) => formatCurrency(price),
        align: 'right',
        sorter: (a, b) => a.price - b.price,
        filterDropdown(props) {
            const [minPrice, setMinPrice] = useState<number | undefined>(0)
            const [maxPrice, setMaxPrice] = useState<number>()

            return (
                <div className={styles.filterDropdown}>
                    <InputNumber
                        min={0}
                        width={200}
                        maxLength={20}
                        addonAfter="₽"
                        onChange={(val) => val != null && setMinPrice(val)}
                        value={minPrice}
                        placeholder="Мин. бюджет"
                    />
                    <InputNumber
                        min={0}
                        width={200}
                        maxLength={20}
                        addonAfter="₽"
                        onChange={(val) => val != null && setMaxPrice(val)}
                        value={maxPrice}
                        placeholder="Макс. бюджет"
                    />
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                            if (
                                typeof minPrice === 'number' &&
                                typeof maxPrice === 'number'
                            ) {
                                minPrice < maxPrice &&
                                    getLeadsHttp({
                                        price: {
                                            from: minPrice,
                                            to: maxPrice,
                                        },
                                    })
                            } else {
                                getLeadsHttp({
                                    price: {
                                        from: minPrice,
                                        to: maxPrice,
                                    },
                                })
                            }

                            props.close()
                        }}
                    >
                        Применить
                    </Button>

                    <Button
                        size="small"
                        onClick={() => {
                            setMaxPrice(undefined)
                            setMinPrice(undefined)
                        }}
                    >
                        Отчистить
                    </Button>
                </div>
            )
        },
    }

    const columns: TableProps<Lead>['columns'] = [
        {
            title: 'Название',
            dataIndex: 'name',
        },
        {
            ...priceColumn,
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            render(status) {
                return <StatusTag {...status} />
            },
        },
        {
            title: 'Ответственный',
            dataIndex: 'responsibleUser',
            render: (responsibleUser) => responsibleUser.name,
        },
        {
            title: 'Дата создания',
            dataIndex: 'createdAt',
            render: (createdAt) => formatTime(createdAt),
            sorter: (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
        },
    ]

    const expandableProps: ExpandableConfig<Lead> = {
        expandedRowRender(lead: Lead) {
            return (
                <List>
                    {lead.contacts.length
                        ? lead.contacts.map((contact) => {
                              return <Contact {...contact} key={contact.id} />
                          })
                        : 'Без контактов'}
                </List>
            )
        },
    }

    useEffect(getLeadsHttp, [])

    return (
        <Card
            className={styles.content}
            title="Тестовое задание"
            extra={
                <a
                    href="https://github.com/mvaydev/nestjs-test"
                    target="_blank"
                >
                    Исходный код
                </a>
            }
        >
            <ConfigProvider
                renderEmpty={() => {
                    return (
                        <Empty
                            description="Нет сделок"
                            image={Empty.PRESENTED_IMAGE_DEFAULT}
                        />
                    )
                }}
            >
                <Table
                    className={styles.table}
                    columns={columns}
                    dataSource={leads && leads}
                    rowKey="id"
                    loading={isLoading}
                    expandable={expandableProps}
                    pagination={false}
                />
            </ConfigProvider>
        </Card>
    )
}
