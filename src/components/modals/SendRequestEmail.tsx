import { useEffect, useState } from 'react'

import Container from '../../styles/components/modals/SendRequestEmail'
import ModalContainer from './Container'
import RequestRaw from '../../models/request'
import { sellerController } from '../../services/offline/controllers/seller'
import { clientController } from '../../services/offline/controllers/client'
import FormButtons from '../FormButtons'
import api from '../../services/api'
import errorAlert from '../../utils/alerts/error'
import successAlert from '../../utils/alerts/success'
import { catchError } from '../../utils/catchError'

const defaultEmailList =
[
	'cruzrepresentacoes@gmail.com',
	'pedidoscruzrepresentacoes@gmail.com'
]

type SendRequestEmailModalProps =
{
	isOpen: boolean
	setIsOpen: (p: boolean) => void

	request: RequestRaw
}

const SendRequestEmailModal: React.FC<SendRequestEmailModalProps> =
({isOpen, setIsOpen, request}) =>
{
	const [emailList, setEmailList] = useState<string[]>(defaultEmailList)
	const [to, setTo] = useState<string[]>([])
	const [text, setText] = useState('')

	useEffect(() =>
	{
		if (request && request._id !== '')
			getEmailList()
	}, [request])

	async function getEmailList()
	{
		let tmpEmailList = [...emailList]

		const seller = await sellerController.rawOne(request.vendedor)
		if (seller && !emailList.includes(seller.email))
			tmpEmailList.push(seller.email)
		
		const client = await clientController.rawOne(request.cliente)
		if (client && !emailList.includes(client.email))
			tmpEmailList.push(client.email)
		
		setEmailList(tmpEmailList)
	}

	function handleToggleEmail(email: string)
	{
		let tmpTo = [...to]
		const existingIndex = to.findIndex(existingEmail => existingEmail === email)

		if (existingIndex < 0)
			tmpTo.push(email)
		else
			tmpTo.splice(existingIndex, 1)
		
		setTo(tmpTo)
	}

	async function handleSubmit()
	{
		if (!request || request._id === '' || request._id.includes('tmpId'))
			return errorAlert(
				'Este pedido ainda não está no sistema online. Sincronize os dados e tente novamente.',
				'E-mail não enviado!'
			)
		
		const data =
		{
			to,
			text
		}

		await api.post(`/mail/requests/${request._id}/system`, data)
			.then(() =>
			{
				successAlert('E-mail enviado com sucesso!')
				setIsOpen(false)
			})
			.catch(catchError)
	}

	return (
		<ModalContainer
			isOpen={isOpen}
			setIsOpen={setIsOpen}
		>
			<Container>
				<ul className='emails'>
					{emailList.map((email, index) => (
						<li key={index} >
							<input
								type='checkbox'
								name={email}
								checked={to.includes(email)}
								onChange={e => handleToggleEmail(e.target.name)}
							/>
							<label htmlFor={email} >
								{email}
							</label>
						</li>
					))}
				</ul>

				<div className='field'>
					<label htmlFor='text'>
						Mensagem do e-mail
					</label>
					<textarea
						name='text'
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