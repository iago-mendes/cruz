import {createContext} from 'react'
import bcrypt from 'bcryptjs'

export interface UserInterface
{
    token: string
    id: string
    role: string
}

class defaultUserClass
{
    token: string
    id: string
    role: string
    setUser: Function

    constructor()
    {
        this.token = ''
        this.id = ''
        this.role = ''
        this.setUser = (user: UserInterface) =>
        {
            this.token = user.token
            this.id = user.id
            this.role = user.role
        }
    }
}

export const defaultUser: UserInterface & {setUser: Function} = new defaultUserClass()

export default createContext(defaultUser)