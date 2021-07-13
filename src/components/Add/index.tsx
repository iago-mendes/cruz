import {useRouter} from 'next/router'
import {FiPlus} from 'react-icons/fi'

import Container from './styles'
import useAuth from '../../hooks/useAuth'

interface AddProps {
	route: string
	hideFromSellers?: boolean
}

const Add: React.FC<AddProps> = ({route, hideFromSellers = true}) => {
	const {user, loading} = useAuth()
	const Router = useRouter()

	if (loading) return null
	if (hideFromSellers && user.role !== 'admin') return null

	return (
		<Container title="Adicionar" onClick={() => Router.push(route)}>
			<FiPlus size={30} />
		</Container>
	)
}

export default Add
