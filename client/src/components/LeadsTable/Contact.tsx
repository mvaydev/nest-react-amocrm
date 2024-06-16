import { PhoneOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Typography } from 'antd'
import styles from './LeadsTable.module.css'

export interface ContactProps {
    name: string
    phone: string
    email: string
}

export default function Contact(contact: ContactProps) {
    return (
        <div className={styles.contact}>
            {contact.name && (
                <>
                    <Avatar>
                        <UserOutlined />
                    </Avatar>
                    <Typography.Link>{contact.name}</Typography.Link>
                </>
            )}
            {contact.phone && (
                <a href={'tel:' + contact.phone}>
                    <PhoneOutlined />
                </a>
            )}
            {contact.email && (
                <a href={'mailto:' + contact.email}>
                    <MailOutlined />
                </a>
            )}
        </div>
    )
}
