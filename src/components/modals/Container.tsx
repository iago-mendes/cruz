import {FiX} from 'react-icons/fi'
import Modal from 'react-modal'
import { BiArrowBack } from 'react-icons/bi'

import Container from '../../styles/components/modals/Container'
import {modalStyle} from '../../styles/global'
import useDimensions from '../../hooks/useDimensions'

Modal.setAppElement('#__next')

interface ModalContainerProps
{
	isOpen: boolean
	setIsOpen: (p: boolean) => void
}

const ModalContainer: React.FC<ModalContainerProps> = ({isOpen, setIsOpen, children}) =>
{
	const {inMobile} = useDimensions()

	return (
		<Modal
			isOpen={isOpen}
			style={modalStyle}
		>
			<Container>
				<header>
					<button className='close' onClick={() => setIsOpen(false)} >
						{
							inMobile
								? <BiArrowBack />
								: <FiX />
						}
					</button>
				</header>
				
				{children}
			</Container>
		</Modal>
	)
}

export default ModalContainer