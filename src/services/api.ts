import axios from 'axios'

const user = JSON.parse(localStorage.getItem('@cruz-representacoes/user'))

const api = axios.create(
{
    baseURL: 'http://localhost:1973',
    headers:
    {
        'token': user.token,
        'id': user.id
    }
})

export default api