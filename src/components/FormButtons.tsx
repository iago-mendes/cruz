import {FiCheck, FiX} from 'react-icons/fi'

import Container from '../styles/components/FormButtons'

interface FormButtonsProps
{
	handleCancel: () => void
	handleSubmit: () => void
}

const FormButtons: React.FC<FormButtonsProps> = ({handleCancel, handleSubmit}) =>
{
	return (
		<Container>
			<button
				type='button'
				onClick={handleCancel}
				className='cancel'
			>
				<FiX size={25} />
				Cancelar
			</button>
			<button
				type='submit'
				className='submit'
				onClick={handleSubmit}
			>
				<FiCheck size={25} />
				Confirmar
			</button>
		</Container>
	)
}

export default FormButtons