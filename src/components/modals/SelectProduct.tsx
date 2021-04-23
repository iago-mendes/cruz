import Modal from 'react-modal'
import {FiCheck, FiX} from 'react-icons/fi'
import {useEffect, useState} from 'react'

import Container from '../../styles/components/modals/SelectProduct'
import {modalStyle, selectStyles} from '../../styles/global'
import Select from 'react-select'
import {SelectOption} from '../../utils/types'
import api from '../../services/api'
import formatImage from '../../utils/formatImage'
import NumberInput from '../NumberInput'

Modal.setAppElement('#__next')

export interface Product
{
	_id?: string
	id: string
	quantidade: number
	preco: number
}

export interface Selected
{
	clientId: string
	companyId: string
	product: Product
}

export const defaultSelected: Selected =
{
	clientId: '',
	companyId: '',
	product:
	{
		id: '',
		quantidade: 0,
		preco: 0
	}
}

interface PricedProduct
{
	id: string
	imagem: string
	nome: string
	unidade: string
	preco: number
}

const defaultPricedProduct: PricedProduct =
{
	id: '',
	imagem: formatImage(undefined),
	nome: '',
	unidade: '',
	preco: 0
}

interface RequestProductModalProps
{
	isOpen: boolean
	setIsOpen: Function

	selected: Selected
	setSelected: Function

	products: Product[]
	setProducts: Function
}

const RequestProductModal: React.FC<RequestProductModalProps> =
({isOpen, setIsOpen, selected, setSelected, products, setProducts}) =>
{
	const [productOptions, setProductOptions] = useState<SelectOption[]>([])
	const [pricedProducts, setPricedProducts] = useState<PricedProduct[]>([])
	const [pricedProduct, setPricedProduct] = useState<PricedProduct>(defaultPricedProduct)

	useEffect(() =>
	{
		if (selected.clientId !== '' && selected.companyId !== '')
			api
				.get(`companies/${selected.companyId}/products/priced`, {params: {client: selected.clientId}})
				.then(({data}:{data: PricedProduct[]}) =>
				{
					const tmpOptions: SelectOption[] = data.map(product => (
					{
						value: product.id,
						label: product.nome
					}))
					setProductOptions(tmpOptions)

					setPricedProducts(data)
				})
				.catch(err => console.log('[err]', err))
	}, [selected])

	useEffect(() =>
	{
		if (selected.product.id !== '')
		{
			const tmpPricedProduct = pricedProducts.find(({id}) => id === selected.product.id)
			if (tmpPricedProduct)
				setPricedProduct(tmpPricedProduct)
		}
		else
			setPricedProduct(defaultPricedProduct)
	}, [selected.product.id])

	useEffect(() =>
	{
		let tmpSelected = {...selected}

		tmpSelected.product.preco = pricedProduct.preco
		setSelected(tmpSelected)
		
		if (selected.product.id !== '')
		{
			let tmpProducts = [...products]
			const index = products.findIndex(({id}) => id === selected.product.id)

			tmpProducts[index].preco = pricedProduct.preco
			setProducts(tmpProducts)
		}
	}, [pricedProduct])

	function handleSelectProduct(e: SelectOption)
	{
		const index = selected.product.id !== ''
			? products.findIndex(({id}) => id === selected.product.id)
			: -1

		let tmpProducts = [...products]

		const productId = e.value
		const tablePrice = 0
		const tmpProduct: Product =
		{
			id: productId,
			quantidade: 0,
			preco: tablePrice
		}

		if (index >= 0)
			tmpProducts[index] = tmpProduct
		else
			tmpProducts.push(tmpProduct)
		setProducts(tmpProducts)

		let tmpSelected = {...selected}
		tmpSelected.product = tmpProduct
		setSelected(tmpSelected)
	}

	function handleChangeProduct(n: number, field: string)
	{
		let tmpSelected = {...selected}
		let tmpProducts = [...products]

		const index = selected.product.id !== ''
			? products.findIndex(({id}) => id === selected.product.id)
			: -1

		if (field === 'quantidade')
		{
			const tmpQuantity = n

			tmpSelected.product.quantidade = tmpQuantity
			tmpProducts[index].quantidade = tmpQuantity
		}
		if (field === 'preco')
		{
			const tmpPrice = n

			tmpSelected.product.preco = tmpPrice
			tmpProducts[index].preco = tmpPrice
		}

		setSelected(tmpSelected)
		setProducts(tmpProducts)
	}

	function priceToString(p: number)
	{
		return 'R$ ' + p.toFixed(2).replace('.', ',')
	}

	return (
		<Modal
			isOpen={isOpen}
			style={modalStyle}
		>
			<Container>
				<header>
					<button onClick={() => setIsOpen(false)}>
						<FiX size={25} />
					</button>
				</header>

				<form onSubmit={e => e.preventDefault()} >
					{/* img & select */}
					<div className='group'>
						<div className='img'>
							<img src={pricedProduct.imagem} alt={pricedProduct.nome} />
						</div>
						<div className='select'>
							<Select
								options={productOptions}
								value=
								{
									selected.product.id !== '' &&
										productOptions.find(({value}) => value === selected.product.id)
								}
								onChange={handleSelectProduct}
								isDisabled={selected.companyId === ''}
								styles={selectStyles}
								placeholder='Selecione o produto'
							/>
						</div>
					</div>
					{/* unit & quantity */}
					<div className='group'>
						<div className='subGroup'>
							<label>Unidade</label>
							<span>{pricedProduct.unidade}</span>
						</div>
						<div className='subGroup'>
							<label htmlFor='quantidade' >
								Quantidade
							</label>
							<NumberInput
								value={selected.product.quantidade}
								setValue={n => handleChangeProduct(n, 'quantidade')}

								name='quantidade'
							/>
						</div>
					</div>
					{/* prices */}
					<div className='group'>
						<div className='subGroup'>
							<label>Preço de tabela</label>
							<span>{priceToString(pricedProduct.preco)}</span>
						</div>
						<div className='subGroup'>
							<label htmlFor='price' >
								Preço líquido
							</label>
							<NumberInput
								value={selected.product.preco}
								setValue={n => handleChangeProduct(n, 'preco')}

								name='price'
								label='R$'
							/>
						</div>
					</div>
					{/* subtotal */}
					<div className='group'>
						<div className='subGroup'>
							<label>Subtotal (sem taxas)</label>
							<span>= {priceToString(selected.product.quantidade * selected.product.preco)}</span>
						</div>
						<button
							type='submit'
							className='confirm'
							onClick={() => setIsOpen(false)}
						>
							<FiCheck />
							<span>Confirmar</span>
						</button>
					</div>
				</form>
			</Container>
		</Modal>
	)
}

export default RequestProductModal