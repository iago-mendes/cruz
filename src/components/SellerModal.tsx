import Modal from 'react-modal'
import {FiX} from 'react-icons/fi'
import {useEffect} from 'react'

import Container from '../styles/components/SellerModal'
import Loading from './Loading'

Modal.setAppElement('#__next')

interface SellerModalProps
{
	isOpen: boolean
	setIsOpen: Function

	seller: {}
}

const SellerModal: React.FC<SellerModalProps> = ({isOpen, setIsOpen, seller}) =>
{

	const style: Modal.Styles =
	{
		content:
		{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			background: 'none',
			border: 'none',
			padding: 0,
			width: '100%',
			height: '100%',
			left: 0,
			top: 0
		},
		overlay:
		{
			backgroundColor: 'rgba(0, 0, 0, 0.5)'
		}
	}

	useEffect(() => console.log('[seller]', seller), [seller])

	return (
		<Modal isOpen={isOpen} style={style}>
			{
				!seller
				? <Loading />
				: (
					<Container>
						<button onClick={() => setIsOpen(false)}>
							<FiX size={25} />
						</button>
					</Container>
				)
			}
		</Modal>
	)
}

export default SellerModal