import {useSession} from 'next-auth/client'
import {useEffect, useState} from 'react'

import { SellerRaw } from '../models/seller'
import api from '../services/api'

export interface User
{
	id: string
	role: string

	data?:
	{
		name: string
		image: string
		email: string
	}
	
	errorMessage?: string
}

export const defaultUser: User =
{
	id: 'not-logged',
	role: 'none'
}

function useUser()
{
	const [session, loading] = useSession()
	const [user, setUser] = useState<User>(defaultUser)

	const isLogged = user.id !== 'not-logged'

	useEffect(() =>
	{
		if (!loading && session)
		{
			const {user: tmp}:{user: any} = session
			const tmpUser: User = tmp

			if (tmpUser && user.id !== tmpUser.id)
				setUser(tmpUser)
			else if (tmpUser.errorMessage)
			{
				let tmp = {...user}
				tmp.errorMessage = tmpUser.errorMessage
				setUser(tmp)
			}
		}
		if (!session)
			setUser(defaultUser)
	}, [loading, session])

	useEffect(() =>
	{
		if (user.id && user.id !== 'not-logged')
			api.get(`sellers-raw/${user.id}`).then(({data}:{data: SellerRaw}) =>
			{
				let tmpUser = {...user}

				tmpUser.data =
				{
					name: data.nome,
					image: data.imagem,
					email: data.email,
				}

				setUser(tmpUser)
			})
			.catch(err =>
			{
				console.log('<< error >>', err.response.data.message)
				console.log('<< user.id >>', user.id)
			})
	}, [user.id])

	return {user, loading, isLogged}
}

export default useUser