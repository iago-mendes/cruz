import {useState} from 'react'
import {FaDownload} from 'react-icons/fa'
import {SiGooglesheets} from 'react-icons/si'

import Container from '../../styles/components/modals/Sheet'
import ModalContainer from './Container'

interface SheetModalProps
{
	headerPath: string
	uploadPath: string
}

const SheetModal: React.FC<SheetModalProps> = ({headerPath, uploadPath}) =>
{
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<ModalContainer
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			>
				<Container>
					<button>
						<FaDownload />
						<span>
							Baixar modelo
						</span>
					</button>
				</Container>
			</ModalContainer>

			<button className='openSheet' title='Planilha' onClick={() => setIsOpen(true)} >
				<SiGooglesheets />
			</button>
		</>
	)
}

export default SheetModal