import Head from 'next/head'
import {FiEdit3, FiTrash} from 'react-icons/fi'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {MdUpdate} from 'react-icons/md'

import api from '../../../services/api'
import Header from '../../../components/Header'
import Container from '../../../styles/pages/empresas/[company]/index'
import Add from '../../../components/Add'
import useAuth from '../../../hooks/useAuth'
import { CompanyTable } from '../../../models/company'
import Product, { loadingProduct } from '../../../models/product'
import SheetModal from '../../../components/modals/Sheet'
import confirmAlert from '../../../utils/alerts/confirm'
import errorAlert from '../../../utils/alerts/error'
import successAlert from '../../../utils/alerts/success'
import TableUpdatesModal from '../../../components/modals/TableUpdates'
import { companyController } from '../../../services/offline/controllers/company'
import { productController } from '../../../services/offline/controllers/product'
import { SkeletonLoading } from '../../../utils/skeletonLoading'

const Products: React.FC = () =>
{
	const {query, push} = useRouter()
	const {company: companyId} = query
	
	const {user} = useAuth()
	const defaultProducts: Product[] = Array(20).fill(loadingProduct)
	const [products, setProducts] = useState<Product[]>(defaultProducts)
	const [companyName, setCompanyName] = useState('')
	const [tables, setTables] = useState<CompanyTable[]>([{_id: 'loading', nome: ''}])

	const [isTableUpdatesModalOpen, setIsTableUpdatesModalOpen] = useState(false)

	useEffect(() =>
	{
		companyController.rawOne(String(companyId))
			.then(data =>
			{
				setCompanyName(data.nome_fantasia)
				setTables(data.tabelas)
			})

		updateProducts()
	}, [])

	async function updateProducts()
	{
		await productController.raw(String(companyId))
			.then(data => setProducts(data))
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
					{user.role === 'admin' && (
						<button
							onClick={() => setIsTableUpdatesModalOpen(true)}
						>
							<MdUpdate />
							<span>Atualizar tabelas</span>
						</button>
					)}
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
							{tables.map(({_id, nome}, index) =>
							{
								if (_id === 'loading')
									return (
										<th key={index} >
											<SkeletonLoading height='1.5rem' width='10rem'/>
										</th>
									)
								else
									return (
										<th key={index} >Tabela {nome}</th>
									)
							})}
						</tr>
					</thead>

					<tbody>
						{products.map((product, index) =>
						{
							if (product._id === 'loading')
								return (
									<tr key={index} >
										<td className='img' >
											<SkeletonLoading height='3rem' width='3rem' />
										</td>
										<td>
											<SkeletonLoading height='1.5rem' width='40rem' />
										</td>
										<td>
											<SkeletonLoading height='1.5rem' width='5rem' />
										</td>
										<td>
											<SkeletonLoading height='1.5rem' width='5rem' />
										</td>
										<td>
											<SkeletonLoading height='1.5rem' width='5rem' />
										</td>
										<td>
											<SkeletonLoading height='1.5rem' width='5rem' />
										</td>
										<td>
											<SkeletonLoading height='1.5rem' width='5rem' />
										</td>
										{product.tabelas.map(({id, preco}, index) =>
										{
											if (id === 'loading')
												return (
													<td key={index}>
														<SkeletonLoading height='1.5rem' width='5rem' />
													</td>
												)
											else
												return (
													<td key={index}>
														R$ {formatNumber(preco)}
													</td>
												)
										})}
									</tr>
								)
							else
								return (
									<tr key={index} >
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
								)
						})}
					</tbody>
				</table>
			</main>
		</Container>
	)
}

export default Products