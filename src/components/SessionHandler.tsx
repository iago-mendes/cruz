import { useEffect, useState } from 'react'

import Login from '../pages/login'
import useAuth from '../hooks/useAuth'
import LoadingModal from './modals/Loading'
import { SyncView } from '../styles/components/SessionHandler'
import { sync } from '../services/offline/db/sync'
import warningAlert from '../utils/alerts/warning'

const SessionHandler: React.FC = ({children}) =>
{
	const {loading, isLogged} = useAuth()

	if (loading)
		return <LoadingModal isOpen={loading} />

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

	if (isSyncing)
		return <SyncView />

	return (
		<>
			{children}
		</>
	)
}

export default SessionHandler