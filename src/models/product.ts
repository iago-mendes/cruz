import formatImage from '../utils/formatImage'

interface Product {
	_id: string
	imagem: string
	nome: string
	codigo: string
	unidade: string
	peso: number
	volume: number
	ipi: number
	st: number
	comissao: number
	tabelas: ProductTable[]
}

export const defaultProduct: Product = {
	_id: '',
	imagem: undefined,
	nome: '',
	codigo: '',
	unidade: '',
	peso: 0,
	volume: 0,
	ipi: 0,
	st: 0,
	comissao: 0,
	tabelas: []
}

export interface ProductTable {
	id: string
	preco: number
}

export type PricedProduct = {
	id: string
	imagem: string
	nome: string
	unidade: string
	preco: number
}

export const defaultPricedProduct: PricedProduct = {
	id: '',
	imagem: formatImage(undefined),
	nome: '',
	unidade: '',
	preco: 0
}

export default Product

export const loadingProduct: Product = {
	_id: 'loading',
	imagem: '',
	nome: '',
	codigo: '',
	unidade: '',
	peso: 0,
	volume: 0,
	ipi: 0,
	st: 0,
	comissao: 0,
	tabelas: [{id: 'loading', preco: 0}]
}
