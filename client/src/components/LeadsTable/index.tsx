import { List, Table, Card } from 'antd'
import type { TableProps } from 'antd'
import StatusTag from './StatusTag'
import Contact from './Contact'

import { Lead, getLeads } from '../../services/LeadsService'
import { formatCurrency, formatTime } from '../../helpers/formatters'

import { useEffect, useState } from 'react'
import styles from './LeadsTable.module.css'
import { ExpandableConfig } from 'antd/es/table/interface'

const columns: TableProps<Lead>['columns'] = [
    {
        title: 'Название',
        dataIndex: 'name',
    },
    {
        title: 'Бюджет',
        dataIndex: 'price',
        render: (price) => formatCurrency(price),
        align: 'right',
        sorter: (a, b) => a.price - b.price,
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

export default function App() {
    const [leads, setLeads] = useState<Lead[]>()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        getLeads()
            .then(setLeads)
            .finally(() => setIsLoading(false))
    }, [])
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
            {
                <Table
                    className={styles.table}
                    columns={columns}
                    dataSource={leads && leads}
                    rowKey="id"
                    loading={isLoading}
                    expandable={expandableProps}
                    pagination={false}
                />
            }
        </Card>
    )
}
