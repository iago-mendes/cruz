import { useEffect, useState } from 'react'

import Login from '../pages/login'
import useAuth from '../hooks/useAuth'
import LoadingModal from './modals/Loading'
import { Background } from '../styles/components/SessionHandler'
import { sync } from '../services/offline/db/sync'
import warningAlert from '../utils/alerts/warning'
import { useRouter } from 'next/router'

const SessionHandler: React.FC = ({children}) =>
{
	const {loading, isLogged} = useAuth()

	if (loading)
		return (
			<>
				<LoadingModal isOpen={loading} />
				<Background />
			</>
		)

	if (!isLogged)
		return <Login />

	return (
		<AuthenticatedSession>
			{children}
		</AuthenticatedSession>
	)
}

const AuthenticatedSession: React.FC = ({children}) =>
{
	const [isSyncing, setIsSyncing] = useState(true)
	const {user} = useAuth()

	const {pathname, push} = useRouter()
	const route = pathname.split('/')[1]

	const adminRoutes =
	[
		'vendedores', 'indicadores'
	]

	const requiresAdminRole = adminRoutes.includes(route) || pathname.includes('editar') || pathname.includes('adicionar')
	const isRouteForbidden = requiresAdminRole && user.role !== 'admin'

	useEffect(() =>
	{
		window.addEventListener('offline', () =>
		{
			warningAlert(
				'Você está offline!', 
				'Algumas funções podem não funcionar perfeitamente.'
			)
		})

		if (navigator.onLine)
			sync().then(() => setIsSyncing(false))
		else
		{
			setIsSyncing(false)
			warningAlert(
				'Você está offline!', 
				'Algumas funções podem não funcionar perfeitamente.'
			)
		}
	}, [])

	useEffect(() =>
	{
		if (isRouteForbidden)
			push('/')
	}, [isRouteForbidden])

	if (isSyncing || isRouteForbidden)
		return <Background />

	return (
		<>
			{children}
		</>
	)
}

export default SessionHandler