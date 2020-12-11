import {GetStaticProps} from 'next'
import Head from 'next/head'
import {useEffect, useState} from 'react'
import useSWR from 'swr'
import {FiEdit3, FiTrash} from 'react-icons/fi'
import {useRouter} from 'next/router'
import {useSession} from 'next-auth/client'

import Container from '../../styles/pages/vendedores/index'
import api from '../../services/api'
import User from '../../utils/userType'
import Loading from '../../components/Loading'

interface Seller
{
	_id: string
	nome: string
	imagem: string
	telefones: Array<{numero: number, whatsapp: boolean}>
	email: string
	senha: string
	funcao: string
	admin: boolean
	representadas: Array<{id: string, comissao: number}>
}

interface SellersProps
{
	sellers: Seller[]
}

const Sellers: React.FC<SellersProps> = ({sellers: staticSellers}) =>
{
	const [session, loading] = useSession()
	const Router = useRouter()

	const [sellers, setSellers] = useState<Seller[]>([])
	const {data, error, revalidate} = useSWR('/api/getSellers')

	useEffect(() =>
	{
		if (data)
			setSellers(data)
		else if (staticSellers)
		{
			setSellers(staticSellers)

			if (error)
				console.error(error)
		}
	}, [data, error, staticSellers])

	if (loading) return <Loading />
	
	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser

  return (
    <Container className='container'>
      <Head>
        <title>Vendedores | Cruz Representações</title>
      </Head>
      <main>
				{sellers.map(seller => (
					<div className={`seller ${seller.admin && 'admin'}`}>
						{
							user.role === 'admin' && (
								<div className="buttons">
									<button title="Editar" onClick={() => Router.push(`/vendedores/${seller._id}/editar`)} >
										<FiEdit3 size={15} />
									</button>
									<button title='Deletar' onClick={() => {}} >
										<FiTrash size={15} />
									</button>
								</div>
							)
						}
						<img src={seller.imagem} alt={seller.nome} />
						<div className="texts">
							<h1>{seller.nome}</h1>
							<h2>{seller.funcao}</h2>
							<h3>{seller.email}</h3>
						</div>
					</div>
				))}
			</main>
    </Container>
  )
}

export const getStaticProps: GetStaticProps = async ctx =>
{
	let sellers: Seller[] = []

	await api.get('sellers-raw').then(({data}) => sellers = data)

	return {
		props: {sellers},
		revalidate: 1
	}
}

export default Sellers