import Head from 'next/head'
import {useSession} from 'next-auth/client'
import Loading from '../components/Loading'
import NotLogged from '../components/NotLogged'

export default function Home() {
	const [session, loading] = useSession()

	if (loading) return <Loading />
	if (!session && !loading) return <NotLogged />

  return (
    <div>
      <Head>
        <title>Cruz Representações</title>
      </Head>
      <h1>Indicadores</h1>
    </div>
  )
}