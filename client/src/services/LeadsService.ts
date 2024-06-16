import { http } from './http'

export interface Lead {
    id: number
    name: string
    price: number
    createdAt: string
    status: {
        id: number
        name: string
        color: string
    }
    contacts: {
        id: number
        name: string
        email: string
        phone: string
    }[]
    responsibleUser: {
        id: number
        name: string
        email: string
    }
}

export interface GetLeadsQuery {
    price?: {
        from?: number
        to?: number
    }
}

export const getLeads = async (query?: GetLeadsQuery) => {
    let data = null

    try {
        const response = await http.get<string>('/leads', {
            params: {
                filter: query,
            },
        })

        data = response.status === 200 && JSON.parse(response.data)
    } catch (error) {
        data = null
    } finally {
        return data
    }
}
