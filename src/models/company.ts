interface Company
{
	_id: string
	imagem?: string
	razao_social: string
	nome_fantasia: string
	cnpj: string
	telefones: Array<number>
	email: string
	descricao_curta?: string
	descricao?: string
	site?: string
	comissao: {porcentagem: number, obs: Array<string>}
	tabelas: CompanyTable[]
}

export const defaultCompany: Company =
{
	_id: '',
	razao_social: '',
	nome_fantasia: '',
	cnpj: '',
	telefones: [],
	email: '',
	comissao: {porcentagem: 0, obs: []},
	tabelas: []
}

export interface CompanyTable
{
	_id?: string
	nome: string
}

export interface CompanyListed
{
	id: string
	imagem: string
	nome_fantasia: string
	descricao_curta: string
}

export default Company