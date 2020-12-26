import Head from 'next/head'
import {FiEdit3, FiTrash} from 'react-icons/fi'
import {useSession} from 'next-auth/client'
import {GetStaticPaths, GetStaticProps} from 'next'
import {useRouter} from 'next/router'
import useSWR from 'swr'
import {useState, useEffect} from 'react'

import api from '../../../../services/api'
import Loading from '../../../../components/Loading'
import Header from '../../../../components/Header'
import Container from '../../../../styles/pages/empresas/[company]/[line]/index'
import User from '../../../../utils/userType'
import {Line} from '../../../../components/forms/Line'
import {Product} from '../../../../components/forms/Product'
import {Company, Table} from '../../../../components/forms/Company'
import Add from '../../../../components/Add'

interface ProductsProps
{
	products: Product[]
	companyName: string
	lineName: string
	tables: Table[]
}

const Products: React.FC<ProductsProps> = ({products: staticProducts, companyName, lineName, tables}) =>
{
	const Router = useRouter()
	const {company: companyId, line: lineId} = Router.query
	
	const [session, loading] = useSession()
	const {data, error, revalidate} = useSWR(`/api/listProducts?company=${companyId}&line=${lineId}`)
	const [products, setProducts] = useState<Product[]>([])

	useEffect(() =>
	{
		if (data)
		{
			setProducts(data)
		}
		else if (staticProducts)
		{
			setProducts(staticProducts)

			if (error)
				console.error(error)
		}
	}, [data, error, staticProducts])

	if (loading) return <Loading />
	
	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser

	function formatNumber(n: number)
	{
		return n.toFixed(2).replace('.', ',')
	}

	async function handleDeleteProduct(product: Product)
	{
		const yes = confirm(`Deseja deletar o produto ${product.nome}?`)
		if (yes)
			await api.delete(`companies/${companyId}/lines/${lineId}/products/${product._id}`).then(() =>
			{
				revalidate()
				alert(`Produto ${product.nome} deletado com sucesso!`)
			})
	}
	
	return (
		<Container className="container">
			<Head>
				<title>{lineName} | Cruz Representações</title>
			</Head>

			<Header display={`${companyName} > ${lineName} > Produtos`} showSearch />
			<Add route={`/empresas/${companyId}/${lineId}/adicionar`} />

			<main>
				<table>
					<thead>
						<tr>
							{user.role === 'admin' && <th>Ações</th>}
							<th>Imagem</th>
							<th>Nome</th>
							<th>Unidade</th>
							<th>Código</th>
							<th>St</th>
							<th>Ipi</th>
							<th>Comissão</th>
							{tables.map(({_id, nome}) => (
								<th key={_id} >Tabela {nome}</th>
							))}
						</tr>
					</thead>

					<tbody>
						{products.map(product => (
							<tr key={product._id} >
								{user.role === 'admin' && (
									<td>
										<div className='actions'>
											<button
												title='Editar'
												onClick={() => Router.push(`/empresas/${companyId}/${lineId}/${product._id}/editar`)}>
												<FiEdit3 size={15} />
											</button>
											<button title='Deletar' onClick={() => handleDeleteProduct(product)}>
												<FiTrash size={15} />
											</button>
										</div>
									</td>
								)}
								<td className='img' >
									<img src={product.imagem} alt={product.nome} />
								</td>
								<td>{product.nome}</td>
								<td>{product.unidade}</td>
								<td>{product.codigo}</td>
								<td>{formatNumber(product.st)} %</td>
								<td>{formatNumber(product.ipi)} %</td>
								<td>{formatNumber(product.comissao)} %</td>
								{product.tabelas.map(({id, preco}) => (
									<td key={id}>
										R$ {formatNumber(preco)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</main>
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
	let tables: Table[] = []
	await api.get(`companies-all/${company}`)
		.then(({data}:{data: Company}) =>
		{
			companyName = data.nome_fantasia
			tables = data.tabelas
		})
		.catch(err => console.error(err.message))
	
	let lineName = ''
	await api.get(`companies/${company}/lines`)
		.then(({data}:{data: Line[]}) => lineName = data.find(ln => ln.id == line).nome)
		.catch(err => console.error(err.message))

	return {
		props: {staticProducts, companyName, lineName, tables},
		revalidate: 1
	}
}

export default Products