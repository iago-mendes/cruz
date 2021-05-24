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
import Product from '../../../models/product'
import SheetModal from '../../../components/modals/Sheet'
import confirmAlert from '../../../utils/alerts/confirm'
import errorAlert from '../../../utils/alerts/error'
import successAlert from '../../../utils/alerts/success'
import TableUpdatesModal from '../../../components/modals/TableUpdates'
import { companyController } from '../../../services/offline/controllers/company'

const Products: React.FC = () =>
{
	const {query, push} = useRouter()
	const {company: companyId} = query
	
	const {user} = useAuth()
	const [products, setProducts] = useState<Product[]>([])
	const [companyName, setCompanyName] = useState('')
	const [tables, setTables] = useState<CompanyTable[]>([])

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
		await companyController.rawProducts(String(companyId))
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

export default Products