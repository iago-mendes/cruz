import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {FiPlus} from 'react-icons/fi'

import Container from '../styles/components/AddButton'

interface AddButtonProps
{
	route: string
}

const AddButton: React.FC<AddButtonProps> = ({route}) =>
{
	const Router = useRouter()

	return (
		<Container title='Adicionar' onClick={() => Router.push(route)} >
			<FiPlus size={30} />
		</Container>
	)
}

export default AddButton