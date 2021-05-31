import Modal from 'react-modal'
import { FiMinus, FiPlus, FiSearch } from 'react-icons/fi'
import {useEffect, useState} from 'react'

import Container from '../../styles/components/modals/SelectProducts'
import ModalContainer from './Container'
import { companyController } from '../../services/offline/controllers/company'
import { defaultRequestProduct, RequestProduct, Selected } from '../../models/request'
import Product, { PricedProduct } from '../../models/product'
import formatPrice from '../../utils/formatPrice'

Modal.setAppElement('#__next')

type RequestProductModalProps =
{
	isOpen: boolean
	setIsOpen: (p: boolean) => void

	selected: Selected
	setSelected: (selected: Selected) => void

	products: RequestProduct[]
	setProducts: (products: RequestProduct[]) => void
}

const RequestProductModal: React.FC<RequestProductModalProps> =
({isOpen, setIsOpen, selected, setSelected, products, setProducts}) =>
{
	const [pricedProducts, setPricedProducts] = useState<PricedProduct[]>([])
	const [rawProducts, setRawProducts] = useState<Product[]>([])

	useEffect(() =>
	{
		if (selected.clientId !== '' && selected.companyId !== '')
			companyController.listPricedProducts(selected.companyId, selected.clientId)
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

	return (
		<ModalContainer
			isOpen={isOpen}
			setIsOpen={setIsOpen}
		>
			<Container>
				<div className='header' >
					<div className='display'>
						<h1>Catálogo</h1>
						<button>
							Salvar
						</button>
					</div>
					<div className='search'>
						<FiSearch />
						<input
							type='text'
							placeholder='Buscar produtos'
						/>
					</div>
				</div>

				<div className='products'>
					{pricedProducts.map((pricedProduct, index) =>
					{
						const existingProduct = products.find(({id}) => id === pricedProduct.id)
						const product = existingProduct
							? existingProduct
							: defaultRequestProduct

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
									<div className='quantity'>
										<h3>
											{product.quantidade}
										</h3>
										<span>
											{rawProduct.unidade}
										</span>
									</div>
									<div className='controller'>
										<button className='less'>
											<FiMinus />
										</button>
										<button className='more'>
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
						{10} selecionados
					</span>

					<span>
						Total: <strong>{formatPrice(1523.783, true)}</strong>
					</span>
				</div>
			</Container>
		</ModalContainer>
	)
}

export default RequestProductModal