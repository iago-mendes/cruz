import Modal from 'react-modal'
import { FiEdit3, FiMinus, FiPlus, FiSearch, FiX } from 'react-icons/fi'
import {useEffect, useState} from 'react'

import Container from '../../styles/components/modals/SelectProducts'
import ModalContainer from './Container'
import { companyController } from '../../services/offline/controllers/company'
import { RequestProduct, Selected } from '../../models/request'
import Product, { PricedProduct } from '../../models/product'
import formatPrice from '../../utils/formatPrice'
import { productController } from '../../services/offline/controllers/product'

Modal.setAppElement('#__next')

type RequestProductModalProps =
{
	isOpen: boolean
	setIsOpen: (p: boolean) => void

	selected: Selected
	products: RequestProduct[]
	setProducts: (products: RequestProduct[]) => void
	editProduct: (product: RequestProduct) => void
}

const RequestProductModal: React.FC<RequestProductModalProps> =
({isOpen, setIsOpen, selected, products, setProducts, editProduct}) =>
{
	const [pricedProducts, setPricedProducts] = useState<PricedProduct[]>([])
	const [rawProducts, setRawProducts] = useState<Product[]>([])
	const [search, setSearch] = useState('')

	let searchedProducts = search === ''
		? pricedProducts
		: pricedProducts.filter(product =>
		{
			const index = product.nome.toLowerCase().search(search.toLowerCase())
			return index >= 0
		})
	searchedProducts.sort((a, b) => a.nome < b.nome ? -1 : 1)

	useEffect(() =>
	{
		if (selected.clientId !== '' && selected.companyId !== '')
			productController.listPriced(selected.companyId, selected.clientId)
				.then(data => setPricedProducts(data))
				.catch(error => console.log('<< error >>', error))
	}, [selected])

	useEffect(() =>
	{
		if (selected.companyId !== '')
			companyController.rawOne(selected.companyId)
				.then(company => setRawProducts(company.produtos))
				.catch(error => console.log('<< error >>', error))
	}, [selected.companyId])

	function handleChangeProductQuantity(product: PricedProduct, quantity: number)
	{
		let tmpProducts = [...products]
		let productIndex = products.findIndex(({id}) => id === product.id)

		if (productIndex >= 0)
		{
			if (quantity > 0)
				tmpProducts[productIndex].quantidade = quantity
			else
				tmpProducts.splice(productIndex, 1)
		}
		else if (quantity > 0)
		{
			tmpProducts.push(
				{
					id: product.id,
					preco: product.preco,
					quantidade: quantity,
				})
		}

		setProducts(tmpProducts)
	}

	function getTotalQuantity()
	{
		let totalQuantity = 0

		products.forEach(product =>
		{
			totalQuantity += product.quantidade
		})

		return totalQuantity
	}

	function getTotalPrice()
	{
		let totalPrice = 0

		products.forEach(product =>
		{
			totalPrice += product.quantidade * product.preco
		})

		return totalPrice
	}

	function handleEditProduct(product: RequestProduct)
	{
		setIsOpen(false)
		editProduct(product)
	}

	return (
		<ModalContainer
			isOpen={isOpen}
			setIsOpen={setIsOpen}
		>
			<Container>
				<div className='header' >
					<div className='display'>
						<h1>Catálogo</h1>
						<button onClick={() => setIsOpen(false)}>
							Salvar
						</button>
					</div>
					<div className='search'>
						<FiSearch />
						<input
							type='text'
							placeholder='Buscar produtos'
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
						<FiX onClick={() => setSearch('')} />
					</div>
				</div>

				<div className='products'>
					{searchedProducts.map((pricedProduct, index) =>
					{
						const existingProduct = products.find(({id}) => id === pricedProduct.id)
						const product = existingProduct
							? existingProduct
							: {id: pricedProduct.id, preco: pricedProduct.preco, quantidade: 0}
						
						const removeQuantity = existingProduct ? existingProduct.quantidade - 1 : 0
						const addQuantity = existingProduct ? existingProduct.quantidade + 1 : 1

						const rawProduct = rawProducts.find(({_id}) => _id === pricedProduct.id)

						return (
							<div className='product' key={index} >
								<div className='info'>
									<div className='data'>
										<div className='img'>
											<img src={pricedProduct.imagem} alt={pricedProduct.nome} />
										</div>
										<div className='texts'>
											<h3>
												{pricedProduct.nome}
											</h3>
											<span>
												{rawProduct.codigo}
											</span>
										</div>
									</div>
									<div className='price'>
										<span>
											{formatPrice(pricedProduct.preco, true)}
										</span>
									</div>
								</div>
								<div className='panel'>
									<div className='edit'>
										<button onClick={() => handleEditProduct(product)} >
											<FiEdit3 />
										</button>
									</div>
									<div className='quantity'>
										<h3>
											{product.quantidade}
										</h3>
										<span>
											{rawProduct.unidade}
										</span>
									</div>
									<div className='controller'>
										<button
											className='less'
											onClick={() => handleChangeProductQuantity(pricedProduct, removeQuantity)}
										>
											<FiMinus />
										</button>
										<button
											className='more'
											onClick={() => handleChangeProductQuantity(pricedProduct, addQuantity)}
										>
											<FiPlus />
										</button>
									</div>
								</div>
							</div>
						)
					})}
				</div>

				<div className='summary'>
					<span>
						{getTotalQuantity()} selecionados
					</span>

					<span>
						Total: <strong>{formatPrice(getTotalPrice(), true)}</strong>
					</span>
				</div>
			</Container>
		</ModalContainer>
	)
}

export default RequestProductModal