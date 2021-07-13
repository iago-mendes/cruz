import Modal from 'react-modal'

import {modalStyle} from '../../../styles/modal'
import Loading from '../../Loading'

Modal.setAppElement('#__next')

interface ModalContainerProps {
	isOpen: boolean
}

const LoadingModal: React.FC<ModalContainerProps> = ({isOpen}) => {
	return (
		<Modal isOpen={isOpen} style={modalStyle}>
			<Loading />
		</Modal>
	)
}

export default LoadingModal
