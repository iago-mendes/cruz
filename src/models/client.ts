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
	telefone?: string
	modificadoEm?: string
	contatos: ClientContact[]
}
export default Client

export const defaultClient: Client =
{
	_id: '',
	razao_social: '',
	nome_fantasia: '',
	imagem: '',
	cnpj: '',
	insc_estadual: '',
	email: '',
	senha: '',
	vendedores: [],
	representadas: [],
	telefone: '',
	endereco: {},
	status: {ativo: true, aberto: true, nome_sujo: false},
	condicoes: {prazo: true, cheque: true, vista: true},
	contatos: []
}

export type ClientCompany =
{
	_id?: string
	id: string
	tabela: string
}

export type Address =
{
	rua?: string
	numero?: string
	complemento?: string
	bairro?: string
	cep?: string
	cidade?: string
	uf?: string
}

export type Status =
{
	ativo: boolean
	aberto: boolean
	nome_sujo: boolean
}

export type Conditions =
{
	prazo: boolean
	cheque: boolean
	vista: boolean
}

export type ClientListed =
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

export type ClientContact =
{
	_id?: string
	nome: string
	telefone: string
}

export const loadingClient: ClientListed =
{
	id: 'loading',
	razao_social: '',
	nome_fantasia: '',
	imagem: '',
	status: {ativo: true, aberto: true, nome_sujo: false}
}