import {useRouter} from "next/router"
import {FormEvent, useState} from "react"

import Container from '../../styles/components/forms/Client'
import Dropzone from "../Dropzone"

interface ClientCompany
{
	_id?: string
	id: string
	tabela: string
}

interface Address
{
	rua?: string
	numero?: number
	bairro?: string
	cep?: number
	cidade?: string
	uf?: string
}

interface Status
{
	ativo: boolean
	aberto: boolean
	nome_sujo: boolean
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
	endereco: Address
	status: Status
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
	
	nome_fantasia: string
	setNomeFantasia: Function
	
	id?: string
	client?: Client
}

const ClientForm: React.FC<ClientFormProps> = ({method, nome_fantasia, setNomeFantasia, id, client}) =>
{
	const Router = useRouter()

	const [razao_social, setRazaoSocial] = useState('')
	const [imagem, setImagem] = useState<File>()
	const [cnpj, setCnpj] = useState('')
	const [insc_estadual, setInscEstadual] = useState('')
	const [email, setEmail] = useState('')
	const [senha, setSenha] = useState('')
	const [vendedores, setVendedores] = useState<string[]>([])
	const [representadas, setRepresentadas] = useState<ClientCompany[]>([])
	const [endereco, setendereco] = useState<Address>({})
	const [status, setstatus] = useState<Status>({ativo: true, aberto: true, nome_sujo: false})

	async function handleSubmit(e: FormEvent)
	{
		e.preventDefault()

		const data = new FormData()
	}

	return (
		<Container onSubmit={handleSubmit} >
			{/* imagem */}
			<div className='field'>
				<label htmlFor="imagem">Imagem</label>
				<Dropzone
					name='imageFile'
					id='imageFile'
					onFileUploaded={setImagem}
					shownFileUrl={client && client.imagem}
				/>
			</div>
			{/* razao_social */}
			<div className='field'>
				<label htmlFor="razao_social">Razão social</label>
				<input
					type="text"
					name="razao_social"
					id="razao_social"
					value={razao_social}
					onChange={e => setRazaoSocial(e.target.value)}
				/>
			</div>
			{/* nome_fantasia */}
			<div className='field'>
				<label htmlFor="nome_fantasia">Nome fantasia</label>
				<input
					type="text"
					name="nome_fantasia"
					id="nome_fantasia"
					value={nome_fantasia}
					onChange={e => setNomeFantasia(e.target.value)}
				/>
			</div>
			{/* cnpj */}
			<div className='field'>
				<label htmlFor="cnpj">Cnpj</label>
				<input
					type="text"
					name="cnpj"
					id="cnpj"
					value={cnpj}
					onChange={e => setCnpj(e.target.value)}
				/>
			</div>
			{/* insc_estadual */}
			<div className='field'>
				<label htmlFor="insc_estadual">Inscrição estadual</label>
				<input
					type="text"
					name="insc_estadual"
					id="insc_estadual"
					value={insc_estadual}
					onChange={e => setInscEstadual(e.target.value)}
				/>
			</div>
			{/* email */}
			<div className='field'>
				<label htmlFor="email">E-mail</label>
				<input
					type="text"
					name="email"
					id="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
			</div>
			{/* senha */}
			<div className='field'>
				<label htmlFor="senha">Senha</label>
				<input
					type="text"
					name="senha"
					id="senha"
					value={senha}
					onChange={e => setSenha(e.target.value)}
				/>
			</div>
			<div className="buttons">
				<button type="button" onClick={Router.back}>Cancelar</button>
				<button type="submit">Confirmar</button>
			</div>
		</Container>
	)
}

export default ClientForm