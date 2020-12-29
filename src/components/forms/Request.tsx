interface Type
{
	venda: boolean
	troca: boolean
}

interface Status
{
	concluido: boolean
	enviado: boolean
	faturado: boolean
}

interface Product
{
	_id: string
	id: string
	quantidade: number
	preco: number
}

export interface Request
{
	_id: string
	data: string
	condicao: string
	digitado_por: string
	cliente: string
	vendedor: string
	representada: string
	linha: string
	tipo: Type
	status: Status
	produtos: Product[]
}

export interface ListedRequest
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