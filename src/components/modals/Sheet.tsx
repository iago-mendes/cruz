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
		<Container>
			<ModalContainer
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			>
				<main>
					<button>
						<FaDownload />
						<span>
							Baixar modelo
						</span>
					</button>
				</main>
			</ModalContainer>

			<button className='openSheet' title='Planilha' onClick={() => setIsOpen(true)} >
				<SiGooglesheets />
			</button>
		</Container>
	)
}

export default SheetModal