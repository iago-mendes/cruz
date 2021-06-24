import { signIn, signOut, useSession } from 'next-auth/client'
import { createContext, useEffect, useState } from 'react'

import { sellerController } from '../services/offline/controllers/seller'

export type User =
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
	const [session, loading] = useSession()

	const [user, setUser] = useState<User>(defaultUser)

	const isLogged = user.id !== 'not-logged'

	useEffect(() =>
	{
		updateSession()
	}, [loading])

	useEffect(() =>
	{
		if (user.id && isLogged)
			sellerController.rawOne(user.id)
				.then(data =>
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
				.catch(error =>
				{
					console.log('<< error >>', error)
				})
	}, [user.id])

	function getSavedUser()
	{
		const savedUser = localStorage.getItem('auth-user')
		if (!savedUser)
			return defaultUser
		
		const parsedUser: User = JSON.parse(savedUser)
		return parsedUser
	}

	function saveUser(user: User)
	{
		localStorage.setItem('auth-user', JSON.stringify(user))
	}

	function removeSavedUser()
	{
		localStorage.removeItem('auth-user')
	}

	function updateSession()
	{
		const isOffline = !navigator.onLine

		if (isOffline)
		{
			const savedUser = getSavedUser()
			setUser(savedUser)
			return
		}

		if (!loading && session)
		{
			const {user: tmp}:{user: any} = session
			const tmpUser: User = tmp

			if (tmpUser && user.id !== tmpUser.id)
			{
				setUser(tmpUser)
				saveUser(tmpUser)
			}
			else if (tmpUser.errorMessage)
			{
				let tmp = {...user}
				tmp.errorMessage = tmpUser.errorMessage
				setUser(tmp)
				saveUser(defaultUser)
			}
		}
		else if (!session)
		{
			setUser(defaultUser)
			saveUser(defaultUser)
		}
	}

	async function logIn(email: string, password: string)
	{
		await signIn('credentials', {email, password, callbackUrl: '/'})
	}

	async function logOut()
	{
		removeSavedUser()
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