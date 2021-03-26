import Head from 'next/head'
import {FiEdit3, FiTrash} from 'react-icons/fi'
import {GetStaticPaths, GetStaticProps} from 'next'
import {useRouter} from 'next/router'
import {useState} from 'react'

import api from '../../../services/api'
import Header from '../../../components/Header'
import Container from '../../../styles/pages/empresas/[company]/index'
import Add from '../../../components/Add'
import useUser from '../../../hooks/useUser'
import Company, {CompanyListed, CompanyTable as Table} from '../../../models/company'
import Product from '../../../models/product'
import SheetModal from '../../../components/modals/Sheet'

interface ProductsProps
{
	products: Product[]
	companyName: string
	tables: Table[]
}

const Products: React.FC<ProductsProps> = ({products: staticProducts, companyName, tables}) =>
{
	const {query, push} = useRouter()
	const {company: companyId} = query
	
	const {user} = useUser()
	const [products, setProducts] = useState<Product[]>(staticProducts)

	function updateProducts()
	{
		api.get(`companies/${companyId}/products/raw`)
			.then(({data}:{data: Product[]}) =>
			{
				setProducts(data)
			})
	}

	function formatNumber(n: number)
	{
		return n.toFixed(2).replace('.', ',')
	}

	async function handleDeleteProduct(product: Product)
	{
		const yes = confirm(`Deseja deletar o produto ${product.nome}?`)
		if (yes)
			await api.delete(`companies/${companyId}/products/${product._id}`).then(() =>
			{
				updateProducts()
				alert(`Produto ${product.nome} deletado com sucesso!`)
			})
	}
	
	return (
		<Container className='container'>
			<Head>
				<title>{companyName} - Produtos | Cruz Representações</title>
			</Head>

			<Header display={`${companyName} > Produtos`} showSearch />
			<Add route={`/empresas/${companyId}/adicionar`} />

			{user.role === 'admin' && (
				<SheetModal
					headerPath={`companies/${companyId}/products/sheet/header`}
					uploadPath={`/companies/${companyId}/products/sheet`}
					sheetName='Produtos'
					fileName={`${companyName} (Produtos)`}
					callback={updateProducts}
				/>
			)}

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
												onClick={() => push(`/empresas/${companyId}/${product._id}/editar`)}>
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
	const paths = await api.get('companies')
		.then(({data}:{data: CompanyListed[]}) => (
		
			data.map(company => (
			{
				params: {company: company.id}
			}))
		))

	return {
		paths,
		fallback: true
	}
}

export const getStaticProps: GetStaticProps = async ctx =>
{
	const {company: companyId} = ctx.params

	const products = await api.get(`companies/${companyId}/products/raw`)
		.then(({data}:{data: Product[]}) => data)

	const {companyName, tables} = await api.get(`companies/${companyId}/raw`)
		.then(({data}:{data: Company}) => (
		{
			companyName: data.nome_fantasia,
			tables: data.tabelas
		}))
	
	return {
		props: {products, companyName, tables},
		revalidate: 1
	}
}

export default Products