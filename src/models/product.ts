interface Product
{
	_id: string
	imagem: string
	nome: string
	codigo: number
	unidade: string
	peso: number
	volume: number
	ipi: number
	st: number
	comissao: number
	tabelas: ProductTable[]
}

export const defaultProduct: Product =
{
	_id: '',
	imagem: undefined,
	nome: '',
	codigo: 0,
	unidade: '',
	peso: 0,
	volume: 0,
	ipi: 0,
	st: 0,
	comissao: 0,
	tabelas: []
}

export interface ProductTable
{
	id: string
	preco: number
}

export default Product