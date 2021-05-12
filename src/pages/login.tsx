import Head from 'next/head'
import {ChangeEvent, FormEvent, useEffect, useState} from 'react'
import { useRouter } from 'next/router'

import logo from '../assets/logo.svg'
import Container from '../styles/pages/login'
import LoadingModal from '../components/modals/Loading'
import errorAlert from '../utils/alerts/error'
import { useAuth } from '../contexts/Auth'

export default function Login()
{
	const {user, logIn} = useAuth()
	const router = useRouter()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const [showedError, setShowedError] = useState(false)
	const [loading, setLoading] = useState(false)

	useEffect(() =>
	{
		if (user.errorMessage && !showedError)
		{
			setShowedError(true)
			errorAlert(user.errorMessage)
		}

		if (user.id !== 'not-logged' && router.pathname === '/login')
			router.back()
	}, [user])
	
	function handleChange(e: ChangeEvent<HTMLInputElement>)
	{
		if (e.target.name === 'email') 
			setEmail(e.target.value)
		if (e.target.name === 'password') 
			setPassword(e.target.value)
	}
	
	async function handleSubmit(e: FormEvent)
	{
		e.preventDefault()

		setLoading(true)
		logIn(email, password)
	}
	
	return (
		<Container>
			<Head>
				<title>Entrar | Cruz Representações</title>
			</Head>

			<LoadingModal
				isOpen={loading}
			/>

			<div className='logo'>
				<img src={logo} alt='Cruz representações'/>
				<h1>Cruz Representações</h1>
			</div>

			<form onSubmit={handleSubmit}>
				<div className='fieldInput'>
					<label htmlFor='email'>E-mail</label>
					<input
						value={email}
						onChange={handleChange}
						type='text'
						name='email'
						id='email'
						placeholder='Digite seu e-mail'
					/>
				</div>
				<div className='fieldInput'>
					<label htmlFor='password'>Senha</label>
					<input
						value={password}
						onChange={handleChange}
						type='password'
						name='password'
						id='password'
						placeholder='Digite sua senha'
					/>
				</div>
				<button type='submit'>Entrar</button>
			</form>
		</Container>
	)
}