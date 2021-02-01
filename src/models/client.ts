interface Client
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
	endereco: Address
	status: Status
	condicoes: Conditions
}

export interface ClientCompany
{
	_id?: string
	id: string
	tabela: string
}

export interface Address
{
	rua?: string
	numero?: number
	complemento?: string
	bairro?: string
	cep?: number
	cidade?: string
	uf?: string
}

export interface Status
{
	ativo: boolean
	aberto: boolean
	nome_sujo: boolean
}

export interface Conditions
{
	prazo: boolean
	cheque: boolean
	vista: boolean
}

export interface ClientListed
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

export default Client