import Head from 'next/head'
import { useContext, useEffect } from 'react'

import User from '../utils/userContext'

export default function Home() {
  const user = useContext(User)
  useEffect(() => console.log('[user]', user), [])

  return (
    <div>
      <Head>
        <title>Cruz Representações</title>
      </Head>
      <h1>Indicadores</h1>
    </div>
  )
}

export async function getStaticProps(ctx)
{
  return {
    props: {role: 'seller'}
  }
}