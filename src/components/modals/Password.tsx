import {useState} from 'react'
import {FiEye, FiEyeOff, FiSend} from 'react-icons/fi'
import {FaRandom} from 'react-icons/fa'

import Container from '../../styles/components/modals/Password'
import ModalContainer from './Container'
import useUser from '../../hooks/useUser'
import api from '../../services/api'
import errorAlert from '../../utils/alerts/error'
import sucessAlert from '../../utils/alerts/success'
import warningAlert from '../../utils/alerts/warning'

interface PasswordModalProps
{
	isOpen: boolean
	setIsOpen: (p: boolean) => void

	role: string
	setPwd?: (p: string) => void
}

const PasswordModal: React.FC<PasswordModalProps> = ({isOpen, setIsOpen, role, setPwd}) =>
{
	const {user} = useUser()
	const [inputType, setInputType] = useState('password')

	const [newPwd, setNewPwd] = useState('')
	const [newPwd2, setNewPwd2] = useState('')

	function toggleVisibility()
	{
		if (inputType === 'password')
			setInputType('text')
		if (inputType === 'text')
			setInputType('password')
	}

	function handleSubmit()
	{
		if (newPwd !== newPwd2)
			return warningAlert('A confirmação da senha não corresponde à senha!')
		
		if (setPwd)
		{
			setPwd(newPwd)
			setIsOpen(false)
			
			return
		}

		const data =
		{
			senha: newPwd
		}

		api.put(`change-password/${role}/${user.id}`, data)
			.then(() =>
			{
				setIsOpen(false)
				sucessAlert('Senha enviada com sucesso!')
			})
			.catch(error =>
			{
				errorAlert(error.response.data.message)
			})
	}

	return (
		<ModalContainer
			isOpen={isOpen}
			setIsOpen={setIsOpen}
		>
			<Container>
				<div className='options'>
					<button
						title={inputType === 'password' ? 'Mostrar senhas' : 'Esconder senhas'}
						onClick={toggleVisibility}
					>
						{inputType === 'password' && <FiEye />}
						{inputType === 'text' && <FiEyeOff />}
						<span>
							{
								inputType === 'password'
								? 'Mostrar senhas'
								: 'Esconder senhas'
							}
						</span>
					</button>

					<button
						title='Gerar senha aleatória'
					>
						<FaRandom />
						<span>
							Gerar senha aleatória
						</span>
					</button>
				</div>

				<form onSubmit={e => e.preventDefault()} >
					<div className='field'>
						<label htmlFor='new'>Nova senha</label>
						<input
							type={inputType}
							id='new'
							name='new'
							value={newPwd}
							onChange={e => setNewPwd(e.target.value)}
						/>
					</div>
					<div className='field'>
						<label htmlFor='new2'>Confirme nova senha</label>
						<input
							type={inputType}
							id='new2'
							name='new2'
							value={newPwd2}
							onChange={e => setNewPwd2(e.target.value)}
						/>
					</div>
				</form>
				
				<button className='submit' onClick={handleSubmit} >
					<FiSend size={25} />
					<span>Confirmar</span>
				</button>
			</Container>
		</ModalContainer>
	)
}

export default PasswordModal