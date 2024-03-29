import Head from 'next/head'
import {FiEdit3, FiEye, FiEyeOff, FiImage} from 'react-icons/fi'
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
import SheetModal from '../../../components/_modals/Sheet'
import successAlert from '../../../utils/alerts/success'
import TableUpdatesModal from '../../../components/_modals/TableUpdates'
import {companyController} from '../../../services/offline/controllers/company'
import {productController} from '../../../services/offline/controllers/product'
import {SkeletonLoading} from '../../../components/SkeletonLoading'
import {useMemo} from 'react'
import {catchError} from '../../../utils/catchError'
import {selectStyles} from '../../../styles/select'
import {SelectOption} from '../../../models'
import {TableDropzone} from '../../../components/TableDropzone'
import UpdateProductsImageModal from '../../../components/_modals/UpdateProductsImage'

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
	const [isUpdateProductsImageModalOpen, setIsUpdateProductsImageModalOpen] =
		useState(false)

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

	async function handleUploadImage(file: File, id: string) {
		const data = new FormData()
		data.append('imagem', file)

		await api
			.put(`companies/${companyId}/products/${id}`, data)
			.then(() => successAlert('Imagem do produto atualizada com sucesso!'))
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

			<UpdateProductsImageModal
				isOpen={isUpdateProductsImageModalOpen}
				setIsOpen={setIsUpdateProductsImageModalOpen}
				companyId={String(companyId)}
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
						<>
							<button onClick={() => setIsTableUpdatesModalOpen(true)}>
								<MdUpdate />
								<span>Atualizar tabelas</span>
							</button>

							<button onClick={() => setIsUpdateProductsImageModalOpen(true)}>
								<FiImage />
								<span>Atualizar imagens</span>
							</button>
						</>
					)}
				</div>

				<div className="tableContainer">
					<table>
						<thead>
							<tr>
								{user.role === 'admin' && <th>Ações</th>}
								<th>Imagem</th>
								<th>Código</th>
								<th className="name">Nome</th>
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
									else
										return (
											<th key={_id} className="table">
												Tab. {nome}
											</th>
										)
								})}
							</tr>
						</thead>

						<tbody>
							{searchedProducts.map((product, index) => {
								if (product._id === 'loading')
									return (
										<tr key={index}>
											{user.role === 'admin' && (
												<td>
													<SkeletonLoading
														height="1.5rem"
														width="5rem"
														showAnimation={false}
													/>
												</td>
											)}
											<td className="img">
												<SkeletonLoading
													height="3rem"
													width="3rem"
													showAnimation={false}
												/>
											</td>
											<td>
												<SkeletonLoading
													height="1.5rem"
													width="5rem"
													showAnimation={false}
												/>
											</td>
											<td>
												<SkeletonLoading
													height="1.5rem"
													width="13rem"
													showAnimation={false}
												/>
											</td>
											<td>
												<SkeletonLoading
													height="1.5rem"
													width="5rem"
													showAnimation={false}
												/>
											</td>
											<td>
												<SkeletonLoading
													height="1.5rem"
													width="5rem"
													showAnimation={false}
												/>
											</td>
											<td>
												<SkeletonLoading
													height="1.5rem"
													width="5rem"
													showAnimation={false}
												/>
											</td>
											<td>
												<SkeletonLoading
													height="1.5rem"
													width="5rem"
													showAnimation={false}
												/>
											</td>
											{product.tabelas.map(({id, preco}, index) => {
												if (id === 'loading')
													return (
														<td key={index}>
															<SkeletonLoading
																height="1.5rem"
																width="5rem"
																showAnimation={false}
															/>
														</td>
													)
												else return <td key={id}>R$ {formatNumber(preco)}</td>
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
													</div>
												</td>
											)}
											<td className="img">
												<TableDropzone
													shownFileUrl={product.imagem}
													onFileUploaded={file =>
														handleUploadImage(file, product._id)
													}
												/>
											</td>
											<td>{product.codigo}</td>
											<td className="name">{product.nome}</td>
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
				</div>
			</main>
		</Container>
	)
}

export default Products
