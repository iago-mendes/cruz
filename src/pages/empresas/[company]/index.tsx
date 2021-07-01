import Head from 'next/head'
import {FiEdit3, FiTrash, FiEye, FiEyeOff} from 'react-icons/fi'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {MdUpdate} from 'react-icons/md'
import Select from 'react-select'

import api from '../../../services/api'
import Header from '../../../components/Header'
import Container from '../../../styles/pages/empresas/[company]/index'
import Add from '../../../components/Add'
import useAuth from '../../../hooks/useAuth'
import {CompanyTable} from '../../../models/company'
import Product, {loadingProduct} from '../../../models/product'
import SheetModal from '../../../components/modals/Sheet'
import confirmAlert from '../../../utils/alerts/confirm'
import errorAlert from '../../../utils/alerts/error'
import successAlert from '../../../utils/alerts/success'
import TableUpdatesModal from '../../../components/modals/TableUpdates'
import {companyController} from '../../../services/offline/controllers/company'
import {productController} from '../../../services/offline/controllers/product'
import {SkeletonLoading} from '../../../utils/skeletonLoading'
import {Image} from '../../../components/Image'
import {useMemo} from 'react'
import {catchError} from '../../../utils/catchError'
import {selectStyles} from '../../../styles/global'
import {SelectOption} from '../../../models'

const filterOptions: SelectOption[] = [
	{label: 'Todos produtos', value: 'all'},
	{label: 'Produtos ativos', value: 'not blocked'},
	{label: 'Produtos inativos', value: 'blocked'}
]

const Products: React.FC = () => {
	const {user} = useAuth()
	const {query, push} = useRouter()
	const {company: companyId, search: querySearch} = query

	const defaultProducts: Product[] = Array(300).fill(loadingProduct)
	const [products, setProducts] = useState<Product[]>(defaultProducts)
	const [companyName, setCompanyName] = useState('')
	const [tables, setTables] = useState<CompanyTable[]>([
		{_id: 'loading', nome: ''}
	])

	const [isTableUpdatesModalOpen, setIsTableUpdatesModalOpen] = useState(false)

	const [search, setSearch] = useState('')
	const [selectedFilter, setSelectedFilter] = useState(filterOptions[1].value)
	const searchedProducts = useMemo(
		() =>
			products
				.filter(product => {
					if (selectedFilter === 'all') return true
					else if (selectedFilter === 'not blocked')
						return product.isBlocked != true
					else if (selectedFilter === 'blocked')
						return product.isBlocked === true
					else return false
				})
				.filter(product => {
					const codeResult = product.codigo
						.toLowerCase()
						.includes(search.toLowerCase())
					const nameResult = product.nome
						.toLowerCase()
						.includes(search.toLowerCase())

					return codeResult || nameResult
				}),
		[products, search, selectedFilter]
	)

	useEffect(() => {
		companyController.rawOne(String(companyId)).then(data => {
			setCompanyName(data.nome_fantasia)
			setTables(data.tabelas)
		})

		updateProducts()
	}, [])

	useEffect(() => {
		if (querySearch != undefined) setSearch(String(querySearch))
	}, [querySearch])

	async function updateProducts() {
		await productController.raw(String(companyId)).then(data => {
			const tmpProducts = data
			tmpProducts.sort((a, b) => (a.nome < b.nome ? -1 : 1))
			setProducts(tmpProducts)
		})
	}

	function formatNumber(n: number | undefined) {
		if (!n) return '0,00'

		const parsedNumber = parseFloat(String(n))
		if (Number.isNaN(parseFloat)) return '0,00'

		return parsedNumber.toFixed(2).replace('.', ',')
	}

	async function handleDeleteProduct(product: Product) {
		confirmAlert(
			'Você tem certeza?',
			`Se você continuar, o produto ${product.nome} será deletado!`,
			() =>
				api
					.delete(`companies/${companyId}/products/${product._id}`)
					.then(() => {
						updateProducts()
						successAlert(`Produto ${product.nome} deletado com sucesso!`)
					})
					.catch(err => {
						errorAlert(err.response.message.data)
					})
		)
	}

	async function toggleProductBlockStatus(
		productId: string,
		currentStatus: boolean | undefined
	) {
		const isBlocked = currentStatus == undefined ? true : !currentStatus

		const index = products.findIndex(({_id}) => _id === productId)
		const tmpProducts = [...products]
		tmpProducts[index].isBlocked = isBlocked
		setProducts(tmpProducts)

		await api
			.put(`companies/${companyId}/products/${productId}`, {isBlocked})
			.catch(catchError)
	}

	return (
		<Container className="container">
			<Head>
				<title>{companyName} - Produtos | Cruz Representações</title>
			</Head>

			<SheetModal
				headerPath={`sheet/companies/${companyId}/products/header`}
				uploadPath={`sheet/companies/${companyId}/products`}
				downloadPath={`sheet/companies/${companyId}/products`}
				sheetName="Produtos"
				fileName={`${companyName} (Produtos)`}
				callback={updateProducts}
			/>

			<TableUpdatesModal
				isOpen={isTableUpdatesModalOpen}
				setIsOpen={setIsTableUpdatesModalOpen}
				companyId={String(companyId)}
				callback={updateProducts}
			/>

			<Header
				display={`${companyName} > Produtos`}
				showSearch
				search={search}
				setSearch={search => push(`/empresas/${companyId}?search=${search}`)}
				searchPlaceholder="Código ou nome"
			/>
			<Add route={`/empresas/${companyId}/adicionar`} />

			<main>
				<div className="productsActions">
					<div className="filter">
						<span>Exibir</span>
						<Select
							value={filterOptions.find(
								option => option.value === selectedFilter
							)}
							onChange={option => setSelectedFilter(option.value)}
							options={filterOptions}
							styles={selectStyles}
							className="select"
							isSearchable={false}
						/>
					</div>
					{user.role === 'admin' && (
						<button onClick={() => setIsTableUpdatesModalOpen(true)}>
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
							<th>Código</th>
							<th>Nome</th>
							<th>Unidade</th>
							<th>Ipi</th>
							<th>St</th>
							<th>Comissão</th>
							{tables.map(({_id, nome}, index) => {
								if (_id === 'loading')
									return (
										<th key={index}>
											<SkeletonLoading height="1.5rem" width="10rem" />
										</th>
									)
								else return <th key={_id}>Tabela {nome}</th>
							})}
						</tr>
					</thead>

					<tbody>
						{searchedProducts.map((product, index) => {
							if (product._id === 'loading')
								return (
									<tr key={index}>
										<td className="img">
											<SkeletonLoading height="3rem" width="3rem" />
										</td>
										<td>
											<SkeletonLoading height="1.5rem" width="40rem" />
										</td>
										<td>
											<SkeletonLoading height="1.5rem" width="5rem" />
										</td>
										<td>
											<SkeletonLoading height="1.5rem" width="5rem" />
										</td>
										<td>
											<SkeletonLoading height="1.5rem" width="5rem" />
										</td>
										<td>
											<SkeletonLoading height="1.5rem" width="5rem" />
										</td>
										<td>
											<SkeletonLoading height="1.5rem" width="5rem" />
										</td>
										{product.tabelas.map(({id, preco}, index) => {
											if (id === 'loading')
												return (
													<td key={index}>
														<SkeletonLoading height="1.5rem" width="5rem" />
													</td>
												)
											else return <td key={index}>R$ {formatNumber(preco)}</td>
										})}
									</tr>
								)
							else
								return (
									<tr
										key={product._id}
										className={product.isBlocked === true ? 'blocked' : ''}
									>
										{user.role === 'admin' && (
											<td>
												<div className="actions">
													<button
														title={
															product.isBlocked === true
																? 'Desbloquear'
																: 'Bloquear'
														}
														onClick={() =>
															toggleProductBlockStatus(
																product._id,
																product.isBlocked
															)
														}
													>
														{product.isBlocked === true ? (
															<FiEyeOff />
														) : (
															<FiEye />
														)}
													</button>
													<button
														title="Editar"
														onClick={() =>
															push(
																`/empresas/${companyId}/${product._id}/editar`
															)
														}
													>
														<FiEdit3 />
													</button>
													<button
														title="Deletar"
														onClick={() => handleDeleteProduct(product)}
														className="delete"
													>
														<FiTrash />
													</button>
												</div>
											</td>
										)}
										<td className="img">
											<Image src={product.imagem} alt={product.nome} />
										</td>
										<td>{product.codigo}</td>
										<td>{product.nome}</td>
										<td>{product.unidade}</td>
										<td>{formatNumber(product.ipi)} %</td>
										<td>{formatNumber(product.st)} %</td>
										<td>{formatNumber(product.comissao)} %</td>
										{product.tabelas.map(({id, preco}) => (
											<td key={id}>R$ {formatNumber(preco)}</td>
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
