import Modal from 'react-modal'
import {FiX} from 'react-icons/fi'
import {useEffect, useState} from 'react'

import Container from '../../styles/components/forms/RequestProductModal'
import {modalStyle, selectStyles} from '../../styles/global'
import {Product as RawProduct} from './Product'
import Select from 'react-select'
import {SelectOption} from '../../utils/types'
import api from '../../services/api'

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
	lineId: string
	product: Product
}

export const defaultSelected: Selected =
{
	clientId: '',
	companyId: '',
	lineId: '',
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

	useEffect(() =>
	{
		if (selected.clientId !== '' && selected.companyId !== '' && selected.lineId !== '')
			api
				.get(`companies/${selected.companyId}/lines/${selected.lineId}/products-priced`, {params: {client: selected.clientId}})
				.then(({data}:{data: PricedProduct[]}) =>
				{
					const tmpOptions: SelectOption[] = data.map(product => (
					{
						value: product.id,
						label: product.nome
					}))
					setProductOptions(tmpOptions)
				})
				.catch(err => console.log('[err]', err))
	}, [selected])

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
					<Select
						options={productOptions}
						value=
						{
							selected.product.id !== '' &&
								productOptions.find(({value}) => value === selected.product.id)
						}
						onChange={handleSelectProduct}
						isDisabled={selected.lineId === ''}
						styles={selectStyles}
						placeholder='Selecione o produto'
					/>
				</form>
			</Container>
		</Modal>
	)
}

export default RequestProductModal