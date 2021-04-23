import {useSession} from "next-auth/client";

import Loading from './Loading'
import Login from '../pages/login'

const SessionHandler: React.FC = ({children}) =>
{
	const [session, loading] = useSession()
	
	if (loading) return <Loading style={{height: '100vh'}} />

	if (!session && !loading) return <Login />

	return (
		<>
			{children}
		</>
	)
}

export default SessionHandler