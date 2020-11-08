import {useEffect, useState} from "react"
import {getCookies} from 'cookies-next'
import Router from "next/router"

import User, {UserInterface, defaultUser} from '../utils/userContext'

const ContextProvider: React.FC = ({children}) =>
{
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<UserInterface>()

    useEffect(() =>
    {
        const token: string = getCookies(null, 'token')
        const id: string = getCookies(null, 'id')
        const role: string = getCookies(null, 'role')

        setUser({token, id, role})
        setIsLoading(false)
    }, [])

    if (isLoading) return <h1>Carregando...</h1>
    if(!user.token)
    {
        Router.push('/login')
        return null
    }

    let userContext = defaultUser
    userContext.setUser(user)

    return (
        <User.Provider value={userContext}>
            {children}
        </User.Provider>
    )
}

export default ContextProvider