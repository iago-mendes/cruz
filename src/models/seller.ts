export interface SellerShowed
{
	id: string
	imagem: string
	nome: string
	funcao: string
	telefones: Array<
		{
			numero: number
			whatsapp: boolean
		}>
	representadas: Array<
		{
			id: string
			nome_fantasia: string
		}>
}

export interface SellerRaw
{
	_id: string
	nome: string
	imagem: string
	telefones: Array<
		{
			numero: number
			whatsapp: boolean
		}>
	email: string
	senha: string
	funcao: string
	admin: boolean
	representadas: Array<
		{
			id: string
			comissao: number
		}>
}