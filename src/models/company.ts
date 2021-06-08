import Product from './product'

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
	produtos: Product[]
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
	condicoes: [],
	produtos: []
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

export const loadingCompany: CompanyListed =
{
	id: 'loading',
	imagem: '',
	nome_fantasia: '',
	descricao_curta: ''
}