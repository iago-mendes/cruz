interface ClientCompany
{
	_id: string
	id: string
	tabela: string
}

export interface Client
{
	_id: string
	razao_social: string
	nome_fantasia: string
	imagem: string
	cnpj: string
	insc_estadual: string
	email: string
	senha: string
	vendedores: string[]
	representadas: ClientCompany[]
	endereco:
	{
		rua: string
		numero: number
		bairro: string
		cep: number
		cidade: string
		uf: string
	}
	status:
	{
		ativo: boolean
		aberto: boolean
		nome_sujo: boolean
	}
}

export interface ListedClient
{
	id: string
	razao_social: string
	nome_fantasia: string
	imagem: string
	status:
	{
		ativo: boolean
		aberto: boolean
		nome_sujo: boolean
	}
}