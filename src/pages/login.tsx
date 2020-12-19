import Head from 'next/head'
import {ChangeEvent, FormEvent, useState} from 'react'
import {signIn} from 'next-auth/client'

import logo from '../assets/logo.svg'
import Container from '../styles/pages/login'

export default function Home() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	
	function handleChange(e: ChangeEvent<HTMLInputElement>)
	{
		if (e.target.name === 'email') setEmail(e.target.value)
		if (e.target.name === 'password') setPassword(e.target.value)
	}
	
	async function handleSubmit(e: FormEvent)
	{
		e.preventDefault()
		signIn('credentials', {email, password, callbackUrl: '/'})
	}
	
	return (
		<Container>
			<Head>
				<title>Entrar | Cruz Representações</title>
			</Head>

			<div className="logo">
				<img src={logo} alt="Cruz representações"/>
				<h1>Cruz Representações</h1>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="fieldInput">
					<label htmlFor="email">E-mail</label>
					<input
						value={email}
						onChange={handleChange}
						type="text"
						name="email"
						id="email"
						placeholder="Digite seu e-mail"
					/>
				</div>
				<div className="fieldInput">
					<label htmlFor="password">Senha</label>
					<input
						value={password}
						onChange={handleChange}
						type="password"
						name="password"
						id="password"
						placeholder="Digite sua senha"
					/>
				</div>
				<button type="submit">Entrar</button>
			</form>
		</Container>
		)
	}