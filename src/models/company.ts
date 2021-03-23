interface Company // raw
{
	_id: string
	imagem?: string
	razao_social: string
	nome_fantasia: string
	cnpj: string
	telefones: Array<string>
	email: string
	descricao_curta?: string
	descricao?: string
	site?: string
	comissao: {porcentagem: number, obs: string[]}
	tabelas: CompanyTable[]
	condicoes: CompanyCondition[]
	// products
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
	tabelas: [],
	condicoes: []
}

export interface CompanyTable
{
	_id?: string
	nome: string
}

export interface CompanyCondition
{
	_id?: string
	nome: string
	precoMin: number
}

export interface CompanyListed
{
	id: string
	imagem: string
	nome_fantasia: string
	descricao_curta: string
}

export interface CompanyShowed
{
  id: string
  imagem: string
  nome_fantasia: string
  descricao: string
  site: string
}

export default Company