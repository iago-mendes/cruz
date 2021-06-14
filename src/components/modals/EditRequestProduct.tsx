import { FiMinus, FiPlus } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import Select from 'react-select'

import Container from '../../styles/components/modals/EditRequestProduct'
import ModalContainer from './Container'
import { companyController } from '../../services/offline/controllers/company'
import { RequestProduct, Selected } from '../../models/request'
import Product, { defaultProduct } from '../../models/product'
import formatPrice from '../../utils/formatPrice'
import NumberInput from '../NumberInput'
import formatImage from '../../utils/formatImage'
import { SelectOption } from '../../models'
import { CompanyTable } from '../../models/company'
import { selectStyles } from '../../styles/global'

type EditRequestProductModalProps =
{
	isOpen: boolean
	setIsOpen: (p: boolean) => void

	selected: Selected
	setSelected: (selected: Selected) => void
	products: RequestProduct[]
	setProducts: (products: RequestProduct[]) => void
}

const EditRequestProductModal: React.FC<EditRequestProductModalProps> =
({isOpen, setIsOpen, selected, setSelected, products, setProducts}) =>
{
	const [rawProduct, setRawProduct] = useState<Product>(defaultProduct)
	const [discounts, setDiscounts] = useState<number[]>([])
	const [productTable, setProductTable] = useState({id: '', price: 0})
	const [companyTables, setCompanyTables] = useState<CompanyTable[]>([])

	const tableOptions: SelectOption[] = rawProduct.tabelas.map(table =>
	{
		const companyTable = companyTables.find(({_id}) => _id === table.id)

		return (
			{
				label: `${companyTable && companyTable.nome} (${table.preco})`,
				value: table.id
			}
		)
	})

	useEffect(() =>
	{
		if (selected.companyId !== '' && selected.product.id !== '')
			companyController.rawOne(selected.companyId)
				.then(company =>
				{
					const tmpRawProduct = company.produtos.find(({_id}) => _id === selected.product.id)
					setRawProduct(tmpRawProduct ? tmpRawProduct : defaultProduct)

					const clientCompanyTable = tmpRawProduct.tabelas
						.find(table => table.id === selected.clientCompanyTableId)
					
					const tmpProductTable = clientCompanyTable
						? clientCompanyTable
						: tmpRawProduct.tabelas[0]
					setProductTable({id: tmpProductTable.id, price: tmpProductTable.preco})
				})
				.catch(error => console.log('<< error >>', error))
	}, [selected.companyId, selected.product.id])
	
	useEffect(() =>
	{
		if (selected.companyId !== '')
			companyController.rawOne(selected.companyId)
				.then(company => setCompanyTables(company.tabelas))
	}, [selected.companyId])

	useEffect(() =>
	{
		if (productTable.price !== 0)
			updatePrice(productTable.price)
	}, [productTable, discounts])

	useEffect(() =>
	{
		if (selected.product.id !== '')
		{
			const existingIndex = products.findIndex(({id}) => id === selected.product.id)

			if (existingIndex >= 0)
			{
				let tmpProducts = [...products]

				if (selected.product.quantidade <= 0)
					tmpProducts.splice(existingIndex, 1)
				else
					tmpProducts[existingIndex] = selected.product
				setProducts(tmpProducts)
			}
			else if (selected.product.quantidade > 0)
			{
				let tmpProducts = [...products]
				tmpProducts.push(selected.product)
				setProducts(tmpProducts)
			}
		}
	}, [selected.product.id, selected.product.quantidade, selected.product.preco])

	function handleAddDiscount()
	{
		let tmpDiscounts = [...discounts]
		tmpDiscounts.push(0)
		setDiscounts(tmpDiscounts)
	}

	function handleRemoveDiscount(index: number)
	{
		let tmpDiscounts = [...discounts]
		tmpDiscounts.splice(index, 1)
		setDiscounts(tmpDiscounts)
	}

	function handleChangeDiscount(value: number, index: number)
	{
		let tmpDiscounts = [...discounts]
		tmpDiscounts[index] = value
		setDiscounts(tmpDiscounts)
	}

	function handleSelectTable(option: SelectOption)
	{
		const id = option.value
		const price = rawProduct.tabelas.find(table => table.id === id).preco

		setProductTable({id, price})
	}

	function handleIncrementQuantity()
	{
		const newQuantity = selected.product.quantidade + 1

		let tmpSelected = {...selected}
		tmpSelected.product.quantidade = newQuantity
		setSelected(tmpSelected)
	}
	
	function handleDecrementQuantity()
	{
		const oldQuantity = selected.product.quantidade
		const newQuantity = oldQuantity > 0 ? selected.product.quantidade - 1 : 0

		let tmpSelected = {...selected}
		tmpSelected.product.quantidade = newQuantity
		setSelected(tmpSelected)
	}

	function updatePrice(basePrice: number)
	{
		let tmpPrice = basePrice
	
		discounts.forEach(discount =>
		{
			tmpPrice -= tmpPrice * discount / 100
		})

		let tmpSelected = {...selected}
		tmpSelected.product.preco = tmpPrice
		setSelected(tmpSelected)
	}

	function calcSubtotal()
	{
		const subtotal = selected.product.quantidade * selected.product.preco
		return subtotal
	}

	return (
		<ModalContainer
			isOpen={isOpen}
			setIsOpen={setIsOpen}
		>
			<Container>
				<div className='header' >
					<h1>Editar item</h1>
					<button onClick={() => setIsOpen(false)}>
						Salvar
					</button>
				</div>

				<div className='info'>
					<div className='img'>
						<img src={formatImage(rawProduct.imagem)} alt={rawProduct.nome} />
					</div>

					<div className='texts'>
						<h3>
							{rawProduct.nome}
						</h3>
						<span>
							{rawProduct.codigo}
						</span>
					</div>
				</div>

				<div className='panel'>
					<div className='quantity'>
						<h3>
							{selected.product.quantidade}
						</h3>
						<span>
							{rawProduct.unidade}
						</span>
					</div>
					<div className='controller'>
						<button
							className='less'
							onClick={handleDecrementQuantity}
						>
							<FiMinus />
						</button>
						<button
							className='more'
							onClick={handleIncrementQuantity}
						>
							<FiPlus />
						</button>
					</div>
				</div>

				{/* table */}
				<div className='field'>
					<label htmlFor='table'>Tabela</label>
					<Select
						value={tableOptions.find(({value}) => value === productTable.id)}
						options={tableOptions}
						onChange={handleSelectTable}
						name='table'
						styles={selectStyles}
					/>
				</div>

				{/* discounts */}
				<div className='field' >
					<label htmlFor='discount'>Descontos (%)</label>
					<ul>
						{discounts.map((discount, index) => (
							<li key={index} >
								<NumberInput
									value={discount}
									setValue={n => handleChangeDiscount(n, index)}

									name='discount'
									placeholder='0,00 %'
								/>
								<button type='button' onClick={() => handleRemoveDiscount(index)} >
									<FiMinus />
								</button>
							</li>
						))}
						<button type='button' onClick={handleAddDiscount}>
							<FiPlus />
							<span>
								Adicionar desconto
							</span>
						</button>
					</ul>
				</div>

				{/* price */}
				<div className='last field'>
					<label htmlFor='price'>Preço líquido</label>
					<NumberInput
						value={selected.product.preco}
						setValue={n => updatePrice(n)}

						name='price'
						label='R$'
					/>
				</div>

				<div className='summary'>
					<span>
						Valor subtotal (sem impostos): <strong>{formatPrice(calcSubtotal(), true)}</strong>
					</span>
				</div>
			</Container>
		</ModalContainer>
	)
}

export default EditRequestProductModal