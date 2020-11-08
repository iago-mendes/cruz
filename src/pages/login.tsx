import {getCookies, setCookies} from 'cookies-next'
import Head from 'next/head'
import { ChangeEvent, FormEvent, useState } from 'react'
import bcrypt from 'bcryptjs'
import Router from 'next/router'

import logo from '../assets/logo.svg'
import api from '../services/api'

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

    const data = {email, password}

    await api.post('/login', data)
    .then(res =>
    {
        if (res.data.token)
        {
            const {token, id, role} = res.data
            setCookies(null, 'token', token)
            setCookies(null, 'id', id)
            setCookies(null, 'role', bcrypt.hashSync(role, 16))
            alert('Você está logado!')
          Router.push('/')
        }
        alert('Algo errado aconteceu!')
        console.log(res)
    })
    .catch(error =>
    {
        alert(error.response)
        console.log('[error]', error)
    })
  }

  return (
    <div id="login">
      <Head>
        <title>Login | Cruz Representações</title>
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
    </div>
  )
}

export async function getStaticProps(ctx)
{
  let user = {token: '', id: '', role: ''}
  
  const token = getCookies(ctx, 'token')
  const id = getCookies(ctx, 'id')
  const role = getCookies(ctx, 'role')
  
  if (token && id && role) user = {token, id, role}

  return {
    props: {user}
  }
}