import Modal from 'react-modal'

import Container from '../../styles/components/forms/RequestProductModal'
import {modalStyle} from '../../styles/global'
import {Product as RawProduct} from './Product'

Modal.setAppElement('#__next')

export interface Product
{
	_id?: string
	id: string
	quantidade: number
	preco: number
}

interface RequestProductModalProps
{
	isOpen: boolean
	setIsOpen: Function

	product: {request: Product, raw: RawProduct}
}

const RequestProductModal: React.FC<RequestProductModalProps> = ({isOpen, setIsOpen, product}) =>
{
	return (
		<Modal
			isOpen={isOpen}
			style={modalStyle}
		>
			<Container>
				<h1>hello world!</h1>
			</Container>
		</Modal>
	)
}

export default RequestProductModal