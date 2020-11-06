import axios from 'axios'

const api = axios.create(
{
    baseURL: 'http://localhost:1973',
    headers:
    {
        'token': localStorage.getItem('@cruz-representacoes/user'),
        'id': localStorage.getItem('@cruz-representacoes/user')
    }
})

export default api