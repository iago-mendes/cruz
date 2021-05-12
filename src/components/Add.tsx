import {useRouter} from 'next/router'
import {FiPlus} from 'react-icons/fi'

import useAuth from '../hooks/useAuth'
import Container from '../styles/components/Add'

interface AddProps
{
	route: string
}

const Add: React.FC<AddProps> = ({route}) =>
{
	const {user, loading} = useAuth()
	const Router = useRouter()

	if (loading)
		return null
	if (user.role !== 'admin')
		return null

	return (
		<Container title='Adicionar' onClick={() => Router.push(route)} >
			<FiPlus size={30} />
		</Container>
	)
}

export default Add