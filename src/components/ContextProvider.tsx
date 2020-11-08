import {useEffect, useState} from "react"
import {getCookies} from 'cookies-next'
import Router from "next/router"
import jwt from 'jsonwebtoken'

import User, {UserInterface, defaultUser} from '../utils/userContext'
import Login from '../pages/login'

const ContextProvider: React.FC = ({children}) =>
{
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<UserInterface>()

    useEffect(() =>
    {
        const token = getCookies(null, 'token')

        if(token)
        {
            let id = ''
            let role = ''
            const payload = jwt.decode(token)
            if (typeof payload !== 'string')
            {
                id = payload.id
                role = payload.role
            }

            setUser({token, id, role})
        }
        else setUser({token: undefined, id: undefined, role: undefined})
        
        setIsLoading(false)
    }, [])

    if (isLoading) return <h1>Carregando...</h1>
    if(!user.token) return <Login/>

    let userContext = defaultUser
    userContext.setUser(user)

    return (
        <User.Provider value={userContext}>
            {children}
        </User.Provider>
    )
}

export default ContextProvider