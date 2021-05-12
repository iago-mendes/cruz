import Head from 'next/head'
import {FiEdit3, FiTrash} from 'react-icons/fi'
import {GetStaticPaths, GetStaticProps} from 'next'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {MdUpdate} from 'react-icons/md'

import api from '../../../services/api'
import Header from '../../../components/Header'
import Container from '../../../styles/pages/empresas/[company]/index'
import Add from '../../../components/Add'
import useAuth from '../../../hooks/useAuth'
import Company, {CompanyListed, CompanyTable as Table} from '../../../models/company'
import Product from '../../../models/product'
import SheetModal from '../../../components/modals/Sheet'
import confirmAlert from '../../../utils/alerts/confirm'
import errorAlert from '../../../utils/alerts/error'
import successAlert from '../../../utils/alerts/success'
import TableUpdatesModal from '../../../components/modals/TableUpdates'

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
	
	const {user} = useAuth()
	const [products, setProducts] = useState<Product[]>(staticProducts)

	const [isTableUpdatesModalOpen, setIsTableUpdatesModalOpen] = useState(false)

	useEffect(() =>
	{
		updateProducts()
	}, [])

	function updateProducts()
	{
		api.get(`companies/${companyId}/products/raw`)
			.then(({data}:{data: Product[]}) =>
			{
				setProducts(data)
			})
	}

	function formatNumber(n: number | undefined)
	{
		if (!n)
			return '0,00'

		return n.toFixed(2).replace('.', ',')
	}

	async function handleDeleteProduct(product: Product)
	{
		confirmAlert(
			'Você tem certeza?',
			`Se você continuar, o produto ${product.nome} será deletado!`,
			() => api.delete(`companies/${companyId}/products/${product._id}`)
				.then(() =>
				{
					updateProducts()
					successAlert(`Produto ${product.nome} deletado com sucesso!`)
				})
				.catch(err =>
				{
					errorAlert(err.response.message.data)
				})
		)
	}
	
	return (
		<Container className='container'>
			<Head>
				<title>{companyName} - Produtos | Cruz Representações</title>
			</Head>

			<SheetModal
				headerPath={`sheet/companies/${companyId}/products/header`}
				uploadPath={`sheet/companies/${companyId}/products`}
				downloadPath={`sheet/companies/${companyId}/products`}
				sheetName='Produtos'
				fileName={`${companyName} (Produtos)`}
				callback={updateProducts}
			/>

			<TableUpdatesModal
				isOpen={isTableUpdatesModalOpen}
				setIsOpen={setIsTableUpdatesModalOpen}
				companyId={String(companyId)}
				callback={updateProducts}
			/>

			<Header display={`${companyName} > Produtos`} />
			<Add route={`/empresas/${companyId}/adicionar`} />

			<main>
				<div className='productsActions'>
					<button
						onClick={() => setIsTableUpdatesModalOpen(true)}
					>
						<MdUpdate />
						<span>Atualizar tabelas</span>
					</button>
				</div>

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
												<FiEdit3 />
											</button>
											<button title='Deletar' onClick={() => handleDeleteProduct(product)}>
												<FiTrash />
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

export const getStaticPaths: GetStaticPaths = async () =>
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