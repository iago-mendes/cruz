import Login from '../pages/login'
import useUser from '../hooks/useUser';
import useDimensions from '../hooks/useDimensions';
import LoadingModal from './modals/Loading';
import { MobileView } from '../styles/components/SessionHandler';

const SessionHandler: React.FC = ({children}) =>
{
	const {loading, isLogged} = useUser()
	const {inDesktop} = useDimensions()
	
	if (!inDesktop)
		return (
			<MobileView>
				<h1>Acesso negado!</h1>
				<p>O acesso ao sistema da <strong>Cruz Representações</strong> não é permitido em dispositivos móveis.</p>
			</MobileView>
		)

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