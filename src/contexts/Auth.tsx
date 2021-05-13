import { signIn, signOut, useSession } from 'next-auth/client'
import { createContext, useEffect, useState } from 'react'
import cookies from 'js-cookie'

import api from '../services/api'
import { SellerRaw } from '../models/seller'

type User =
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

type AuthContextData =
{
	user: User
	isLogged: boolean
	loading: boolean
	updateSession: () => void
	logIn: (email: string, password: string) => void
	logOut: () => void
}

export const AuthContext = createContext({} as AuthContextData)

const AuthContextProvider: React.FC = ({children}) =>
{
	const [session, isSessionLoading] = useSession()

	const defaultUser: User =
	{
		id: 'not-logged',
		role: 'none'
	}
	const [user, setUser] = useState<User>(defaultUser)
	const [loading, setLoading] = useState(true)

	const isLogged = user.id !== 'not-logged'

	useEffect(() =>
	{
		setTimeout(() =>
		{
			setLoading(false)
		}, 1000 * 2) // 2s
	}, [])

	useEffect(() =>
	{
		if (loading)
			updateSession()
	}, [isSessionLoading, session, loading])

	useEffect(() =>
	{
		if (user.id && user.id !== 'not-logged')
			api.get(`sellers-raw/${user.id}`)
				.then(({data}:{data: SellerRaw}) =>
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

	function updateSession()
	{
		const isOffline = !navigator.onLine

		if (isOffline)
		{
			const savedUser = cookies.get('auth-user')
			const tmpUser = savedUser == undefined
				? defaultUser
				: JSON.parse(savedUser)

			setUser(tmpUser)

			setLoading(false)
			return
		}

		if (!isSessionLoading && session)
		{
			const {user: tmp}:{user: any} = session
			const tmpUser: User = tmp

			if (tmpUser && user.id !== tmpUser.id)
			{
				setUser(tmpUser)
				cookies.set('auth-user', JSON.stringify(tmpUser))
			}
			else if (tmpUser.errorMessage)
			{
				let tmp = {...user}
				tmp.errorMessage = tmpUser.errorMessage
				setUser(tmp)
				cookies.set('auth-user', JSON.stringify(defaultUser))
			}
		}
		else if (!session)
		{
			setUser(defaultUser)
			cookies.set('auth-user', JSON.stringify(defaultUser))
		}
	}

	async function logIn(email: string, password: string)
	{
		await signIn('credentials', {email, password, callbackUrl: '/'})
	}

	async function logOut()
	{
		cookies.remove('auth-user')
		setUser(defaultUser)

		await signOut({callbackUrl: '/login'})
	}

	return (
		<AuthContext.Provider
			value =
				{{
					user,
					isLogged,
					loading,
					updateSession,
					logIn,
					logOut
				}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthContextProvider