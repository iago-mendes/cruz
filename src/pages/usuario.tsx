import {getCookies} from 'cookies-next'
import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Usuário | Cruz Representações</title>
      </Head>
      <h1>Usuário</h1>
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