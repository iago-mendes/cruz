import axios from 'axios'
// import cookies from 'next-cookies'
import {getCookies} from 'cookies-next'

// const user = JSON.parse(cookies(null))
const token = getCookies(null, 'token')
const id = getCookies(null, 'id')

const api = axios.create(
{
    baseURL: 'http://206.189.193.235:7373',
    headers:
    {
        'token': token,
        'id': id
    }
})

export default api