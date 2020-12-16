import {useSession} from 'next-auth/client'
import {useRouter} from 'next/router'
import {FiPlus} from 'react-icons/fi'

import Container from '../styles/components/Add'
import User from '../utils/userType'

interface AddProps
{
	route: string
}

const Add: React.FC<AddProps> = ({route}) =>
{
	const [session, loading] = useSession()
	const Router = useRouter()

	if (loading)
		return null
	
	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser

	if (user.role !== 'admin')
		return null

	return (
		<Container title='Adicionar' onClick={() => Router.push(route)} >
			<FiPlus size={30} />
		</Container>
	)
}

export default Add