import { Axios } from 'axios'
import QueryString from 'qs'

export const http = new Axios({
    baseURL: import.meta.env.VITE_API_URL,
    responseType: 'json',
    paramsSerializer: (params) => {
        return QueryString.stringify(params)
    },
})
