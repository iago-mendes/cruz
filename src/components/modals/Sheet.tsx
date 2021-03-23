import {useState} from 'react'
import {FaDownload} from 'react-icons/fa'
import {SiGooglesheets} from 'react-icons/si'

import Container, {OpenSheetButton} from '../../styles/components/modals/Sheet'
import ModalContainer from './Container'

interface SheetModalProps
{
	headerPath: string
	uploadPath: string
}

const SheetModal: React.FC<SheetModalProps> = ({headerPath, uploadPath}) =>
{
	const [isOpen, setIsOpen] = useState(false)
	const [sheet, setSheet] = useState<File>()

	function handleSubmit()
	{}

	return (
		<>
			<ModalContainer
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			>
				<Container>
					<button className='model' >
						<FaDownload />
						<span>
							Baixar modelo
						</span>
					</button>
					<form onSubmit={e => e.preventDefault()} >
						<label htmlFor='sheet'>Planilha</label>
						<input
							type='file'
							name='sheet'
							id='sheet'
							onChange={e => setSheet(e.target.files[0])}
						/>
					</form>
					
					<div className='buttons'>
						<button type='button' onClick={() => setIsOpen(false)} className='cancel' >
							Cancelar
						</button>
						<button type='submit' className='submit' onClick={handleSubmit} >
							Confirmar
						</button>
					</div>
				</Container>
			</ModalContainer>

			<OpenSheetButton title='Planilha' onClick={() => setIsOpen(true)} >
				<SiGooglesheets />
			</OpenSheetButton>
		</>
	)
}

export default SheetModal