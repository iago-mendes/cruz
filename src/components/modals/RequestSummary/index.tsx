import {FiEdit3, FiTrash} from 'react-icons/fi'
import {IoIosArrowUp} from 'react-icons/io'

import Container from './styles'
import RawProduct, {
	defaultProduct as defaultRawProduct
} from '../../../models/product'
import {RequestProduct} from '../../../models/request'
import formatPrice from '../../../utils/formatPrice'

type RequestSummaryModalProps = {
	isExpanded: boolean
	setIsExpanded: (isExpanded: boolean) => void

	companyId: string
	products: RequestProduct[]
	setProducts: (products: RequestProduct[]) => void
	rawProductsList: {
		[companyId: string]: RawProduct[]
	}
	editProduct: (product: RequestProduct) => void
}

const RequestSummaryModal: React.FC<RequestSummaryModalProps> = ({
	isExpanded,
	setIsExpanded,
	companyId,
	products,
	setProducts,
	rawProductsList,
	editProduct
}) => {
	function calcSubtotal(
		quantity: number,
		price: number,
		st: number,
		ipi: number
	) {
		let subtotal = quantity * price
		subtotal += (subtotal * st) / 100
		subtotal += (subtotal * ipi) / 100

		return subtotal
	}

	function calcTotalPrice() {
		let total = 0

		if (companyId !== '') {
			products.map(product => {
				if (rawProductsList[companyId]) {
					const rawProduct = rawProductsList[companyId].find(
						({_id}) => _id === product.id
					)

					if (rawProduct) {
						const subtotal = calcSubtotal(
							product.quantidade,
							product.preco,
							rawProduct.st,
							rawProduct.ipi
						)
						total += subtotal
					}
				}
			})
		}

		return total
	}

	function calcTotalProductsPrice() {
		let total = 0

		products.map(requestProduct => {
			const subtotal = requestProduct.quantidade * requestProduct.preco
			total += subtotal
		})

		return total
	}

	function calcTotalQuantity() {
		let totalQuantity = 0

		products.forEach(product => {
			totalQuantity += product.quantidade
		})

		return totalQuantity
	}

	function handleRemoveProduct(product: RequestProduct) {
		const tmpProducts = [...products]
		const productIndex = products.findIndex(({id}) => id === product.id)

		if (productIndex < 0) return

		tmpProducts.splice(productIndex, 1)
		setProducts(tmpProducts)
	}

	return (
		<Container isExpanded={isExpanded}>
			<div className="controller">
				<button onClick={() => setIsExpanded(!isExpanded)}>
					<IoIosArrowUp />
				</button>
			</div>

			<h1 className="totalPrice">{formatPrice(calcTotalPrice(), true)}</h1>

			{isExpanded && (
				<>
					<ul className="details">
						<li>Quantidade total: {calcTotalQuantity()}</li>

						<li>
							Valor total em produtos:{' '}
							{formatPrice(calcTotalProductsPrice(), true)}
						</li>

						<li>
							Valor total em impostos:{' '}
							{formatPrice(calcTotalPrice() - calcTotalProductsPrice(), true)}
						</li>
					</ul>

					<ul className="products">
						{products.map((product, index) => {
							const rawProduct: RawProduct =
								product.id !== '' &&
								companyId !== '' &&
								rawProductsList[companyId]
									? rawProductsList[companyId].find(
											({_id}) => _id === product.id
									  )
									: defaultRawProduct

							return (
								<li key={index}>
									<span className="detail">
										{rawProduct.codigo} - {rawProduct.nome}
									</span>
									<span className="detail">
										{formatPrice(product.preco, true)}
									</span>
									<span>Qtde.: {product.quantidade}</span>
									<div className="actions">
										<button title="Editar" onClick={() => editProduct(product)}>
											<FiEdit3 />
										</button>
										<button
											title="Remover"
											onClick={() => handleRemoveProduct(product)}
										>
											<FiTrash />
										</button>
									</div>
								</li>
							)
						})}
					</ul>
				</>
			)}
		</Container>
	)
}

export default RequestSummaryModal
