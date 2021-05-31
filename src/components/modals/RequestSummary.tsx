import { FiEdit3, FiTrash } from 'react-icons/fi'
import { IoIosArrowUp } from 'react-icons/io'
import { useState } from 'react'

import Container from '../../styles/components/modals/RequestSummary'
import RawProduct, {defaultProduct as defaultRawProduct} from '../../models/product'
import { RequestProduct } from '../../models/request'
import formatPrice from '../../utils/formatPrice'
import useClickOutside from '../../hooks/useClickOutside'

type RequestSummaryModalProps =
{
	companyId: string
	products: RequestProduct[]
	rawProductsList:
	{
		[companyId: string]: RawProduct[]
	}
}

const RequestSummaryModal: React.FC<RequestSummaryModalProps> =
({companyId, products, rawProductsList}) =>
{
	const [isExpanded, setIsExpanded] = useState(false)
	const ref = useClickOutside(() => setIsExpanded(false))

	function calcSubtotal(quantity: number, price: number, st: number, ipi: number)
	{
		let subtotal = quantity * price
		subtotal += subtotal * st / 100
		subtotal += subtotal * ipi / 100

		return subtotal
	}

	function calcTotalPrice()
	{
		let total = 0

		if (companyId !== '')
		{
			products.map(product =>
			{
				if (rawProductsList[companyId])
				{
					const rawProduct = rawProductsList[companyId].find(({_id}) => _id === product.id)
	
					if (rawProduct)
					{
						const subtotal = calcSubtotal(product.quantidade, product.preco, rawProduct.st, rawProduct.ipi)
						total += subtotal
					}
				}
			})
		}

		return total
	}

	function calcTotalProductsPrice()
	{
		let total = 0

		products.map(requestProduct =>
		{
			const subtotal = requestProduct.quantidade * requestProduct.preco
			total += subtotal
		})

		return total
	}

	return (
		<Container
			isExpanded={isExpanded}
			ref={ref}
		>
			<div className='controller'>
				<button onClick={() => setIsExpanded(!isExpanded)} >
					<IoIosArrowUp />
				</button>
			</div>

			<h1 className='totalPrice' >
				{formatPrice(calcTotalPrice(), true)}
			</h1>

			<ul className='details' >
				<li>
					Quantidade total: {products.length}
				</li>

				<li>
					Valor total em produtos: {formatPrice(calcTotalProductsPrice(), true)}
				</li>

				<li>
					Valor total em impostos: {formatPrice(calcTotalPrice() - calcTotalProductsPrice(), true)}
				</li>
			</ul>

			<ul className='products'>
				{products.map((product, index) =>
				{
					const rawProduct: RawProduct = (product.id !== '' && companyId !== '' && rawProductsList[companyId])
						? rawProductsList[companyId].find(({_id}) => _id === product.id)
						: defaultRawProduct

					return (
						<li key={index} >
							<span className='detail'>
								{rawProduct.codigo} - {rawProduct.nome}
							</span>
							<span className='detail'>
								{formatPrice(product.preco, true)}
							</span>
							<span>
								Qtde.: {product.quantidade}
							</span>
							<div className='actions'>
								<button
									title='Editar'
									onClick={() => {}}>
									<FiEdit3 />
								</button>
								<button title='Remover' onClick={() => {}}>
									<FiTrash />
								</button>
							</div>
						</li>
					)})}
			</ul>
		</Container>
	)
}

export default RequestSummaryModal