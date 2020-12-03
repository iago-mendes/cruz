import Head from 'next/head'
import {FiEdit3, FiTrash} from 'react-icons/fi'
import {useSession} from 'next-auth/client'
import {GetStaticPaths, GetStaticProps} from 'next'
import {useRouter} from 'next/router'
import useSWR from 'swr'
import {useState, useEffect} from 'react'

import api from '../../../../services/api'
import Loading from '../../../../components/Loading'
import Header from '../../../../components/CompanyHeader'
import Container from '../../../../styles/pages/empresas/[company]/[line]/index'
import {User} from '../../index'
import {Line} from '../../../../components/forms/Line'

interface Product
{
	_id: string
	imagem: string
	codigo: number
	nome: string
	ipi: number
	st: number
	unidade: string
	comissao: number
	tabelas: Array<{nome: string, preco: number}>
}

interface ProductsProps
{
	products: Product[]
	companyName: string
	lineName: string
}

const Products: React.FC<ProductsProps> = ({products, companyName, lineName}) =>
{
	const Router = useRouter()
	const {company: companyId, line: lineId} = Router.query
	
	const [session, loading] = useSession()
	const {data, error, revalidate} = useSWR(`/api/listProducts?company=${companyId}&line=${lineId}`)
	const [shownProducts, setShownProducts] = useState<Product[]>([])
	
	useEffect(() =>
	{
		if (data)
			setShownProducts(data)
		else if (products)
		{
			setShownProducts(products)

			if (error)
				console.error(error)
		}
	}, [data, error, products])

	if (loading) return <Loading />
	
	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser
	
	return (
		<Container className="container">
			<Head>
				<title>{lineName} | Cruz Representações</title>
			</Head>

			<Header
				display={`${companyName} > ${lineName} > Produtos`}
				showSecondGroup
				addRoute={`/empresas/${companyId}/${lineId}/adicionar`}
			/>

			<div className="scroll">
				
			</div>
		</Container>
	)
}

export const getStaticPaths: GetStaticPaths = async ctx =>
{
	interface Path
	{
		params: { company: string, line: string }
	}

	interface Company
	{
		_id: string
		linhas: Array<{_id: string}>
	}

	const paths: Path[] = await api.get('companies-all').then(({data}:{data: Company[]}) => data.map(company => (
		company.linhas.map(line => (
		{
			params: {company: company._id, line: line._id}
		}))
	)).flat())

	return {
		paths,
		fallback: true
	}
}

export const getStaticProps: GetStaticProps = async ctx =>
{
	const {company, line} = ctx.params

	let staticProducts: Product[] = []
	await api.get(`companies/${company}/lines/${line}/products-raw`)
		.then(res => staticProducts = res.data)
		.catch(err => console.error(err.message))

	let companyName = ''
	await api.get(`companies/${company}`)
		.then(({data}) => companyName = data.nome_fantasia)
		.catch(err => console.error(err.message))
	
	let lineName = ''
	await api.get(`companies/${company}/lines`)
		.then(({data}:{data: Line[]}) => lineName = data.find(ln => ln.id == line).nome)
		.catch(err => console.error(err.message))

	return {
		props: {staticProducts, companyName, lineName},
		revalidate: 1
	}
}

export default Products