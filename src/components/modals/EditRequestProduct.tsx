import { FiMinus, FiPlus } from 'react-icons/fi'
import {useEffect, useState} from 'react'

import Container from '../../styles/components/modals/EditRequestProduct'
import ModalContainer from './Container'
import { companyController } from '../../services/offline/controllers/company'
import { RequestProduct, Selected } from '../../models/request'
import Product, { defaultProduct } from '../../models/product'
import formatPrice from '../../utils/formatPrice'
import NumberInput from '../NumberInput'
import formatImage from '../../utils/formatImage'

type EditRequestProductModalProps =
{
	isOpen: boolean
	setIsOpen: (p: boolean) => void

	selected: Selected
	products: RequestProduct[]
	setProducts: (products: RequestProduct[]) => void
}

const EditRequestProductModal: React.FC<EditRequestProductModalProps> =
({isOpen, setIsOpen, selected, products, setProducts}) =>
{
	const [rawProduct, setRawProduct] = useState<Product>(defaultProduct)
	const [discounts, setDiscounts] = useState<number[]>([])

	useEffect(() =>
	{
		if (selected.companyId !== '' && selected.product.id !== '')
			companyController.rawOne(selected.companyId)
				.then(company =>
				{
					const tmpRawProduct = company.produtos.find(({_id}) => _id === selected.product.id)
					setRawProduct(tmpRawProduct ? tmpRawProduct : defaultProduct)
				})
				.catch(error => console.log('<< error >>', error))
	}, [selected.companyId, selected.product.id])

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
							onClick={() => {}}
						>
							<FiMinus />
						</button>
						<button
							className='more'
							onClick={() => {}}
						>
							<FiPlus />
						</button>
					</div>
				</div>

				{/* price */}
				<div className='field'>
					<label htmlFor='price'>Preço líquido</label>
					<NumberInput
						value={selected.product.preco}
						setValue={n => {}}

						name='price'
						label='R$'
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
									setValue={n => {}}

									name='discount'
									placeholder='0,00 %'
								/>
								<button type='button' onClick={() => {}} >
									<FiMinus />
									<span>
										Remover desconto
									</span>
								</button>
							</li>
						))}
						<button type='button' onClick={() => {}}>
							<FiPlus />
							<span>
								Adicionar desconto
							</span>
						</button>
					</ul>
				</div>

				<div className='summary'>
					<span>
						Subtotal valor: <strong>{formatPrice(150, true)}</strong>
					</span>
				</div>
			</Container>
		</ModalContainer>
	)
}

export default EditRequestProductModal