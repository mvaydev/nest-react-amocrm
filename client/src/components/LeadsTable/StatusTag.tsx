import { Tag } from 'antd'
import { adjustColor } from '../../helpers/adjustColor'

export interface StatusTagProps {
    color: string
    name: string
}

export default function StatusTag(status: StatusTagProps) {
    return (
        <Tag
            color={status.color}
            style={{
                color: adjustColor(status.color, -128),
                border: '1px solid ' + adjustColor(status.color, -20),
            }}
        >
            {status.name}
        </Tag>
    )
}
