import {FormEvent} from "react"

import Container from '../../styles/components/forms/Client'

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

interface ClientFormProps
{
	method: string
	
	nomeFantasia: string
	setNomeFantasia: Function
	
	id?: string
	client?: Client
}

const ClientForm: React.FC<ClientFormProps> = ({method, nomeFantasia, setNomeFantasia, id, client}) =>
{

	async function handleSubmit(e: FormEvent)
	{
		e.preventDefault()

		const data = new FormData()
	}

	return (
		<Container onSubmit={handleSubmit} >
			form			
		</Container>
	)
}

export default ClientForm