import Modal from 'react-modal'
import {FiX} from 'react-icons/fi'
import {ChangeEvent, useEffect, useState} from 'react'

import Container from '../../styles/components/forms/RequestProductModal'
import {modalStyle, selectStyles} from '../../styles/global'
import Select from 'react-select'
import {SelectOption} from '../../utils/types'
import api from '../../services/api'
import formatImage from '../../utils/formatImage'

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
	}, [selected.product])

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

		// const tablePrice =  rawCompaniesList[representada]
		// 	.linhas.find(({_id}) => _id == linha)
		// 	.produtos.find(({_id}) => _id == productId)
		// 	.tabelas.find(({id}) => id === clientCompanyTableId).preco		

		let tmpSelected = {...selected}
		tmpSelected.product = tmpProduct
		setSelected(tmpSelected)
		
	}

	function handleChangeProduct(e: ChangeEvent<HTMLInputElement>, field: string)
	{
		let tmpSelected = {...selected}
		let tmpProducts = [...products]

		const index = selected.product.id !== ''
			? products.findIndex(({id}) => id === selected.product.id)
			: -1

		if (field === 'quantidade')
		{
			const tmpQuantity = Number(e.target.value)

			tmpSelected.product.quantidade = tmpQuantity
			tmpProducts[index].quantidade = tmpQuantity
		}
		if (field === 'preco')
		{
			const tmpPrice = priceToNumber(e.target.value)

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

	function priceToNumber(p: string)
	{
		const [integers, decimals] = p.split(',').map(str => Number(str.replace('/\D/g', '')))

		return Number(integers + '.' + decimals)
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

				<form>
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
					<div className='group'>
						<div className='subGroup'>
							<label>Unidade</label>
							<span>{pricedProduct.unidade}</span>
						</div>
						<div className='subGroup'>
							<label>Quantidade</label>
							<input
								type='number'
								value={selected.product.quantidade}
								onChange={e => handleChangeProduct(e, 'quantidade')}
								disabled={selected.product.id === ''}
							/>
						</div>
					</div>
					<div className='group'>
						<div className='subGroup'>
							<label>Preço de tabela</label>
							<span>{priceToString(pricedProduct.preco)}</span>
						</div>
						<div className='subGroup'>
							<label>Preço líquido</label>
							<input
								type='text'
								value={priceToString(selected.product.preco)}
								onChange={e => handleChangeProduct(e, 'preco')}
								disabled={selected.product.id === ''}
							/>
						</div>
					</div>
					<div className="group">
						<div className="subGroup">
							<label>Subtotal (sem taxas)</label>
							<span>= {priceToString(selected.product.quantidade * selected.product.preco)}</span>
						</div>
					</div>
				</form>
			</Container>
		</Modal>
	)
}

export default RequestProductModal