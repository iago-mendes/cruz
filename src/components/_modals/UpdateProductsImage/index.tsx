import {Container} from './styles'
import FormButtons from '../../FormButtons'
import ModalContainer from '../Container'

type Props = {
	isOpen: boolean
	setIsOpen: (p: boolean) => void

	companyId: string
}

const UpdateProductsImageModal: React.FC<Props> = ({isOpen, setIsOpen}) => {
	function handleCancel() {
		setIsOpen(false)
	}

	function handleSubmit() {}

	return (
		<ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
			<Container>
				<h1>Atualização de imagens</h1>
				<FormButtons handleCancel={handleCancel} handleSubmit={handleSubmit} />
			</Container>
		</ModalContainer>
	)
}

export default UpdateProductsImageModal
