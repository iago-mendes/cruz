interface Request
{
	_id: string
	cliente: string
	vendedor?: string
	representada: string
	produtos: Array<{id: string, quantidade: number, preco: number, linhaId: string}>
	data: string
	condicao: string
	frete: string
	contato: {nome: string, telefone: string}
	digitado_por?: string
	tipo: {venda: boolean, troca: boolean}
	status: {concluido: boolean, enviado: boolean, faturado: boolean}
}

export const defaultRequest: Request =
{
	_id: '',
	cliente: '',
	vendedor: '',
	representada: '',
	produtos: [],
	data: '',
	condicao: '',
	frete: '',
	contato: {nome: '', telefone: ''},
	digitado_por: '',
	tipo: {venda: true, troca: false},
	status: {concluido: false, enviado: false, faturado: false}
}

export type RequestProduct =
{
	_id?: string
	id: string
	quantidade: number
	preco: number
}

export default Request