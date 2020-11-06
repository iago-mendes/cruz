import {useContext} from 'react'
import bcrypt from 'bcryptjs'
import {useRouter} from 'next/router'

import {User, defaultUser} from './userContext'

// interface PrivateRouteParams
// {
//     (component: React.ReactElement, role: string): React.FC | Promise<boolean>
// }

export default function privateRoute(Component: React.FC, role: string)
{
    const userContext = useContext(User)
    const router = useRouter()

    if (bcrypt.compareSync('admin', userContext.role)) role = 'admin'
    if (bcrypt.compareSync('seller', userContext.role) && role !== 'admin') role = 'seller'

    const isRole = bcrypt.compareSync(role, userContext.role)

    if (isRole) return <Component />
    else if (userContext === defaultUser)
    {
        return router.push('/login')
    }
    else
    {
        alert('Você não tem permissão para acessar essa rota.')
        return router.push('/')
    }
}