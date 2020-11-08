import axios from 'axios'
import {getCookies} from 'cookies-next'

const token = getCookies(null, 'token')

const api = axios.create(
{
    baseURL: 'https://api.cruzrepresentacoes.com.br',
    headers:
    {
        'token': token
    }
})

export default api