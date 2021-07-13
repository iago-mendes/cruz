import {useEffect, useState} from 'react'

import Container from './styles'
import ModalContainer from '../Container'
import RequestRaw from '../../../models/request'
import {sellerController} from '../../../services/offline/controllers/seller'
import {clientController} from '../../../services/offline/controllers/client'
import FormButtons from '../../FormButtons'
import api from '../../../services/api'
import errorAlert from '../../../utils/alerts/error'
import successAlert from '../../../utils/alerts/success'
import {catchError} from '../../../utils/catchError'

const defaultEmailList = [
	'cruzrepresentacoes@gmail.com',
	'pedidoscruzrepresentacoes@gmail.com'
]

type SendRequestEmailModalProps = {
	isOpen: boolean
	setIsOpen: (p: boolean) => void

	request: RequestRaw
	callback?: () => void
}

const SendRequestEmailModal: React.FC<SendRequestEmailModalProps> = ({
	isOpen,
	setIsOpen,
	request,
	callback
}) => {
	const [emailList, setEmailList] = useState<string[]>(defaultEmailList)
	const [to, setTo] = useState<string[]>([])
	const [text, setText] = useState('')
	const [otherEmail, setOtherEmail] = useState('')
	const [sendToOtherEmail, setSendToOtherEmail] = useState(false)

	useEffect(() => {
		if (request && request._id !== '') getEmailList()
	}, [request])

	async function getEmailList() {
		const tmpEmailList = [...emailList]

		const seller = await sellerController.rawOne(request.vendedor)
		if (seller && !emailList.includes(seller.email))
			tmpEmailList.push(seller.email)

		const client = await clientController.rawOne(request.cliente)
		if (client && !emailList.includes(client.email))
			tmpEmailList.push(client.email)

		setEmailList(tmpEmailList)
	}

	function handleToggleEmail(email: string) {
		const tmpTo = [...to]
		const existingIndex = to.findIndex(existingEmail => existingEmail === email)

		if (existingIndex < 0) tmpTo.push(email)
		else tmpTo.splice(existingIndex, 1)

		setTo(tmpTo)
	}

	function handleChangeOtherEmail(email: string) {
		if (otherEmail === '' && email !== '') setSendToOtherEmail(true)
		else if (otherEmail !== '' && email === '') setSendToOtherEmail(false)

		setOtherEmail(email)
	}

	async function handleSubmit() {
		if (!request || request._id === '' || request._id.includes('tmpId'))
			return errorAlert(
				'Este pedido ainda não está no sistema online. Sincronize os dados e tente novamente.',
				'E-mail não enviado!'
			)

		const tmpTo = sendToOtherEmail ? [...to, otherEmail] : [...to]

		const data = {
			to: tmpTo,
			text
		}

		await api
			.post(`/mail/requests/${request._id}/system`, data)
			.then(() => {
				successAlert('E-mail enviado com sucesso!')
				setIsOpen(false)

				if (callback) callback()
			})
			.catch(catchError)
	}

	return (
		<ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
			<Container>
				<ul className="emails">
					{emailList.map((email, index) => (
						<li key={index}>
							<input
								type="checkbox"
								name={email}
								checked={to.includes(email)}
								onChange={e => handleToggleEmail(e.target.name)}
							/>
							<label htmlFor={email}>{email}</label>
						</li>
					))}
					<li>
						<input
							type="checkbox"
							name={otherEmail}
							checked={sendToOtherEmail}
							onChange={() => setSendToOtherEmail(!sendToOtherEmail)}
							disabled={otherEmail === ''}
						/>
						<input
							type="text"
							value={otherEmail}
							onChange={e => handleChangeOtherEmail(e.target.value)}
							placeholder="Outro"
						/>
					</li>
				</ul>

				<div className="field">
					<label htmlFor="text">Mensagem do e-mail</label>
					<textarea
						name="text"
						cols={30}
						rows={10}
						value={text}
						onChange={e => setText(e.target.value)}
					/>
				</div>

				<FormButtons
					handleCancel={() => setIsOpen(false)}
					handleSubmit={handleSubmit}
				/>
			</Container>
		</ModalContainer>
	)
}

export default SendRequestEmailModal
