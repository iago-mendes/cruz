import {getCookies} from 'cookies-next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Router from 'next/router'

import privateRoute, {User} from '../utils/privateRoute'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User>()
  useEffect(() =>
  {
    const token: string = getCookies(null, 'token')
    const id: string = getCookies(null, 'id')
    const role: string = getCookies(null, 'role')

    setUser({token, id, role})
    setIsLoading(false)
  }, [])

  if (isLoading) return <h1>Carregando...</h1>
  if(!user.token)
  {
    Router.push('/login')
    return null
  }
  if(!privateRoute(user, 'seller'))
  {
    Router.push('/empresas')
    return null
  }

  return (
    <div>
      <Head>
        <title>Cruz Representações</title>
      </Head>
      <h1>Indicadores</h1>
    </div>
  )
}