import axios from 'axios'
import {getCookies} from 'cookies-next'

const token = getCookies(null, 'token')
const id = getCookies(null, 'id')

const api = axios.create(
{
    baseURL: 'https://api.cruzrepresentacoes.com.br',
    headers:
    {
        'token': token,
        'id': id
    }
})

export default api