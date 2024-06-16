import { Axios } from 'axios'

export const http = new Axios({
    baseURL: import.meta.env.VITE_API_URL,
    responseType: 'json',
})
