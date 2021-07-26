import {createContext, useEffect, useState} from 'react'
import jwt from 'jsonwebtoken'

import api from '../services/api'
import {sellerController} from '../services/offline/controllers/seller'
import errorAlert from '../utils/alerts/error'

type UserData = {
	name: string
	image: string
	email: string
}

export type User = {
	id: string
	role: string

	data?: UserData

	errorMessage?: string
}

export const defaultUser: User = {
	id: 'not-logged',
	role: 'none'
}

type AuthContextData = {
	user: User
	isLogged: boolean
	loading: boolean
	updateSession: () => void
	logIn: (email: string, password: string) => void
	logOut: () => void
}

export const AuthContext = createContext({} as AuthContextData)

const AuthContextProvider: React.FC = ({children}) => {
	const [user, setUser] = useState<User>(defaultUser)
	const [loading, setLoading] = useState(true)

	const isLogged = user.id !== 'not-logged'

	useEffect(() => {
		updateSession()
	}, [loading])

	function updateSession() {
		const token = localStorage.getItem('token')
		updateUser(token)
		setLoading(false)
	}

	function updateUser(token: any) {
		if (!token) return setUser(defaultUser)

		const payload = jwt.decode(token)
		const {id, role} =
			typeof payload === 'string' ? JSON.parse(payload) : payload

		if (id && role) {
			const tmpUser = {id, role}
			setUser(tmpUser)
			fetchUserData(tmpUser)
		}
	}

	async function fetchUserData(user: User) {
		sellerController.rawOne(user.id).then(seller => {
			if (!seller) return

			const data: UserData = {
				email: seller.email,
				image: seller.imagem,
				name: seller.nome
			}

			setUser({...user, data})
		})
	}

	async function logIn(email: string, password: string) {
		setLoading(true)
		const data = {email, password}

		await api
			.post('login/seller', data)
			.then(({data}) => {
				const {token} = data
				if (!token) return

				localStorage.setItem('token', token)
				updateUser(token)
			})
			.catch(error => {
				const errorMessage = String(error.response?.data?.message ?? '')
				errorAlert(errorMessage)
			})

		setLoading(false)
	}

	async function logOut() {
		localStorage.removeItem('token')
		updateUser(undefined)
	}

	return (
		<AuthContext.Provider
			value={{
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
