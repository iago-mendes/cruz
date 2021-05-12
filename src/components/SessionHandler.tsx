import Login from '../pages/login'
import useAuth from '../hooks/useAuth'
import LoadingModal from './modals/Loading'
// import useDimensions from '../hooks/useDimensions'
// import { MobileView } from '../styles/components/SessionHandler'

const SessionHandler: React.FC = ({children}) =>
{
	const {loading, isLogged} = useAuth()
	// const {inDesktop} = useDimensions()
	
	// if (!inDesktop)
	// 	return (
	// 		<MobileView>
	// 			<h1>Acesso negado!</h1>
	// 			<p>O acesso ao sistema da <strong>Cruz Representações</strong> não é permitido em dispositivos móveis.</p>
	// 		</MobileView>
	// 	)

	if (loading)
		return <LoadingModal isOpen={loading} />

	if (!isLogged)
		return <Login />

	return (
		<>
			{children}
		</>
	)
}

export default SessionHandler