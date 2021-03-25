import {useState} from 'react'
import {FaDownload} from 'react-icons/fa'
import {FiCheck, FiX} from 'react-icons/fi'
import {SiGooglesheets} from 'react-icons/si'
import api from '../../services/api'

import Container, {OpenSheetButton} from '../../styles/components/modals/Sheet'
import ModalContainer from './Container'

const fileTypes =
[
	'xlsx',
	'xls',
	'xml',
	'csv',
	'ods',
].map(function(x) { return '.' + x }).join(',')

interface SheetModalProps
{
	headerPath: string
	uploadPath: string
}

const SheetModal: React.FC<SheetModalProps> = ({headerPath, uploadPath}) =>
{
	const [isOpen, setIsOpen] = useState(false)
	const [sheet, setSheet] = useState<File>()

	async function getModel()
	{
		const header: string[] = await api.get(headerPath).then(res => res.data)
		console.log('[header]', header)
	}

	function handleSubmit()
	{}

	return (
		<>
			<ModalContainer
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			>
				<Container>
					<button className='model' onClick={getModel} >
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
							accept={fileTypes}
							onChange={e => setSheet(e.target.files[0])}
						/>
					</form>
					
					<div className='buttons'>
						<button type='button' onClick={() => setIsOpen(false)} className='cancel' >
							<FiX size={25} />
							Cancelar
						</button>
						<button type='submit' className='submit' onClick={handleSubmit} >
							<FiCheck size={25} />
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