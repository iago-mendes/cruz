import bcrypt from 'bcryptjs'

export interface User
{
    token: string
    id: string
    role: string
}

export default function privateRoute(user: User, role: string)
{
    if (bcrypt.compareSync('admin', user.role)) role = 'admin'
    if (bcrypt.compareSync('seller', user.role) && role !== 'admin') role = 'seller'

    const isRole = bcrypt.compareSync(role, user.role)

    if (isRole) return true
    else
    {
        alert('Você não tem permissão para acessar esta rota.')
        return false
    }
}