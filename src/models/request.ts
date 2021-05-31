type Request =
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
export default Request

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

export const defaultRequestProduct: RequestProduct =
{
	id: '',
	quantidade: 0,
	preco: 0
}

export type Type =
{
	venda: boolean
	troca: boolean
}

export type Status =
{
	concluido: boolean
	enviado: boolean
	faturado: boolean
}

export type RequestListed =
{
	id: string
	data: string
	cliente:
	{
		imagem: string
		nome_fantasia: string
		razao_social: string
	}
	vendedor:
	{
		imagem: string
		nome: string
	}
	representada:
	{
		imagem: string
		nome_fantasia: string
		razao_social: string
	}
	tipo: Type
	status: Status
	valorTotal: number
}

export type Selected =
{
	clientId: string
	companyId: string
	product: RequestProduct
	clientCompanyTableId: string
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
	},
	clientCompanyTableId: ''
}