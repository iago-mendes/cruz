import axios from 'axios'

const user = JSON.parse(localStorage.getItem('@cruz-representacoes/user'))

const api = axios.create(
{
    baseURL: 'http://206.189.193.235:7373',
    headers:
    {
        'token': user.token,
        'id': user.id
    }
})

export default api