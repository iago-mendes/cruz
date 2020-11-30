import {useSession} from "next-auth/client";

import Loading from './Loading'
import Login from '../pages/login'

const LoginHandler: React.FC = ({children}) =>
{
	const [session, loading] = useSession()

	if (loading) return <Loading />

	if (!session && !loading) return <Login />

	return (
		<>
			{children}
		</>
	)
}

export default LoginHandler