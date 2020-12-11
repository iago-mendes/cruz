import {GetStaticProps} from 'next'
import Head from 'next/head'
import {useEffect, useState} from 'react'
import useSWR from 'swr'

import Container from '../../styles/pages/vendedores/index'
import api from '../../services/api'

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

	useEffect(() => console.log('[sellers]', sellers), [sellers])

  return (
    <Container className='container'>
      <Head>
        <title>Vendedores | Cruz Representações</title>
      </Head>
      <h1>Vendedores</h1>
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