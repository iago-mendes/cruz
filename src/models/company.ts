import Product from './product'

// raw
export type CompanyRaw = {
	_id: string
	imagem?: string
	razao_social: string
	nome_fantasia: string
	cnpj: string
	telefones: string[]
	email: string
	descricao_curta?: string
	descricao?: string
	site?: string
	comissao: {porcentagem: number; obs: string[]}
	tabelas: CompanyTable[]
	condicoes: CompanyCondition[]
	produtos: Product[]
	relatedTables?: CompanyRelatedTable[]
}

export const defaultCompany: CompanyRaw = {
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

export type CompanyTable = {
	_id?: string
	nome: string
}

export type CompanyCondition = {
	_id?: string
	nome: string
	precoMin: number
}

export type CompanyListed = {
	id: string
	imagem: string
	nome_fantasia: string
	descricao_curta: string
}

export type CompanyShowed = {
	id: string
	imagem: string
	nome_fantasia: string
	descricao: string
	site: string
}

export type CompanyRelatedTable = {
	id: string
	target: string
	relation: number
}

export default CompanyRaw

export const loadingCompany: CompanyListed = {
	id: 'loading',
	imagem: '',
	nome_fantasia: '',
	descricao_curta: ''
}
