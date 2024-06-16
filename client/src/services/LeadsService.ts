import { useState } from 'react'
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

export const getLeads = async () => {
    let data = null

    try {
        const response = await http.get<string>('/leads')

        data = JSON.parse(response.data)
    } catch (error) {
        console.error(error)
    } finally {
        return data
    }
}
