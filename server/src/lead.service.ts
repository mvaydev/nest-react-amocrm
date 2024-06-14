import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common'

interface RawLead {
    id: number
    name: string
    pipeline_id: number
    status_id: number
    responsible_user_id: number
    price: number
    created_at: number
    _embedded: {
        contacts: any[]
    }
}

export interface Lead {
    id: number
    name: string
    price: number
    createdAt: Date
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

@Injectable()
export class LeadService {
    constructor(private readonly httpService: HttpService) {}

    _authGetRequest(endpoint: string, query: object = null) {
        return this.httpService.axiosRef.get(
            process.env.AMO_API_URL + endpoint,
            {
                headers: {
                    'Authorization': 'Bearer ' + process.env.AMO_TOKEN
                },
                params: query
            }
        )
    }

    async _mapLead(rawLead: RawLead): Promise<Lead> {
        // Request lead contacts
        const contacts = []
        for(let contact of rawLead._embedded.contacts) {
            const getContactsUrl = `/contacts/${contact.id}`
            const rawContact = (await this._authGetRequest(getContactsUrl)).data

            const phone = rawContact.custom_fields_values?.find((field: any) => field.field_code === 'PHONE')
            const email = rawContact.custom_fields_values?.find((field: any) => field.field_code === 'EMAIL')

            contacts.push({
                id: rawContact.id,
                name: rawContact.name,
                phone: phone?.values[0].value || '',
                email: email?.values[0].value || ''
            })
        }

        // Request lead status
        const getStatusUrl = `/leads/pipelines/${rawLead.pipeline_id}/statuses/${rawLead.status_id}`
        const rawStatus = (await this._authGetRequest(getStatusUrl)).data
        const status = {
            id: rawStatus.id,
            name: rawStatus.name,
            color: rawStatus.color
        }

        // Request responsible user data
        const getUserUrl = `/users/${rawLead.responsible_user_id}`
        const rawResponsibleUser = (await this._authGetRequest(getUserUrl)).data
        const responsibleUser = {
            id: rawResponsibleUser.id,
            name: rawResponsibleUser.name,
            email: rawResponsibleUser.email
        }

        return {
            id: rawLead.id,
            name: rawLead.name,
            price: rawLead.price,
            createdAt: new Date(rawLead.created_at),
            status,
            responsibleUser,
            contacts
        } as Lead
    }

    async getAll(query: object): Promise<Lead[]> {
        const leadsResponse = await this._authGetRequest('/leads', {
            ...query,
            with: ['contacts']
        })
        const leadsRaw = leadsResponse.data._embedded?.leads

        if(!leadsRaw) throw new NotFoundException()

        const leads = []
        for(let rawLead of leadsRaw) {
            leads.push(await this._mapLead(rawLead))
        }

        return leads
    }
}
