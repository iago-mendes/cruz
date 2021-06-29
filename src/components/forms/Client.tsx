import {useRouter} from 'next/router'
import {ChangeEvent, useEffect, useState} from 'react'
import Select, {OptionsType} from 'react-select'
import Switch from 'react-switch'

import api from '../../services/api'
import Container from '../../styles/components/forms/global'
import {selectStyles} from '../../styles/global'
import Dropzone from '../Dropzone'
import Client, {
	ClientCompany,
	Address,
	Status,
	Conditions,
	ClientContact
} from '../../models/client'
import {SelectOption, SelectOptionsList} from '../../models'
import successAlert from '../../utils/alerts/success'
import PasswordModal from '../modals/Password'
import FormButtons from '../FormButtons'
import {FiMinus, FiPlus} from 'react-icons/fi'
import {companyController} from '../../services/offline/controllers/company'
import {sellerController} from '../../services/offline/controllers/seller'
import {catchError} from '../../utils/catchError'
import {handleObjectId} from '../../utils/handleObjectId'
import warningAlert from '../../utils/alerts/warning'

interface ClientFormProps {
	method: string

	nome_fantasia: string
	setNomeFantasia: (name: string) => void

	id?: string
	client?: Client
}

const ClientForm: React.FC<ClientFormProps> = ({
	method,
	nome_fantasia,
	setNomeFantasia,
	id,
	client
}) => {
	const {back} = useRouter()

	const [razao_social, setRazaoSocial] = useState('')
	const [imagem, setImagem] = useState<File>()
	const [cnpj, setCnpj] = useState('')
	const [insc_estadual, setInscEstadual] = useState('')
	const [email, setEmail] = useState('')
	const [senha, setSenha] = useState('')
	const [vendedores, setVendedores] = useState<string[]>([])
	const [representadas, setRepresentadas] = useState<ClientCompany[]>([])
	const [telefone, setTelefone] = useState('')
	const [contatos, setContatos] = useState<ClientContact[]>([])
	const [endereco, setEndereco] = useState<Address>({})
	const [status, setStatus] = useState<Status>({
		ativo: true,
		aberto: true,
		nome_sujo: false
	})
	const [condicoes, setCondicoes] = useState<Conditions>({
		prazo: true,
		vista: true,
		cheque: true
	})

	const [sellerOptions, setSellerOptions] = useState<SelectOption[]>([])
	const [companyOptions, setCompanyOptions] = useState<SelectOption[]>([])
	const [tableOptions, setTableOptions] = useState<SelectOptionsList>({})

	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
	const [sendCredentialsViaMail, setSendCredentialsViaMail] = useState(false)

	useEffect(() => {
		sellerController.list().then(data => {
			const tmp = data.map(seller => ({
				value: seller.id,
				label: seller.nome
			}))
			setSellerOptions(tmp)
		})

		companyController.raw().then(data => {
			const tmpCompanies: SelectOption[] = []
			const tmpTables: SelectOptionsList = {}

			data.map(company => {
				tmpCompanies.push({
					label: company.nome_fantasia,
					value: company._id
				})

				tmpTables[company._id] = company.tabelas.map(tabela => ({
					label: tabela.nome,
					value: tabela._id
				}))
			})

			setCompanyOptions(tmpCompanies)
			setTableOptions(tmpTables)
		})
	}, [])

	useEffect(() => {
		if (client) {
			if (client.razao_social) setRazaoSocial(client.razao_social)
			if (client.nome_fantasia) setNomeFantasia(client.nome_fantasia)
			if (client.cnpj) setCnpj(client.cnpj)
			if (client.insc_estadual) setInscEstadual(client.insc_estadual)
			if (client.email) setEmail(client.email)
			if (client.senha) setSenha(client.senha)
			if (client.vendedores) setVendedores(client.vendedores)
			if (client.representadas) setRepresentadas(client.representadas)
			if (client.telefone) setTelefone(client.telefone)
			if (client.contatos) setContatos(client.contatos)
			if (client.endereco) setEndereco(client.endereco)
			if (client.status) setStatus(client.status)
			if (client.condicoes) setCondicoes(client.condicoes)
		}
	}, [client])

	function handleSellersChange(e: OptionsType<SelectOption>) {
		if (!e) setVendedores([])
		else {
			const tmp = e.map(option => option.value)
			setVendedores(tmp)
		}
	}

	function handleAddCompany() {
		setRepresentadas([...representadas, {id: '', tabela: ''}])
	}

	function handleRemoveCompany(index: number) {
		const companies = [...representadas]
		companies.splice(index, 1)
		setRepresentadas(companies)
	}

	function handleCompanyChange(e: SelectOption, index: number, field: string) {
		const companies = [...representadas]

		if (field === 'id') companies[index].id = e.value
		else if (field === 'tabela') companies[index].tabela = e.value

		setRepresentadas(companies)
	}

	function handleAddressChange(
		e: ChangeEvent<HTMLInputElement>,
		field: string
	) {
		const tmp = {...endereco}

		if (field === 'rua') tmp.rua = e.target.value
		if (field === 'numero') tmp.numero = e.target.value
		if (field === 'complemento') tmp.complemento = e.target.value
		if (field === 'bairro') tmp.bairro = e.target.value
		if (field === 'cep') tmp.cep = e.target.value
		if (field === 'cidade') tmp.cidade = e.target.value
		if (field === 'uf') tmp.uf = e.target.value

		setEndereco(tmp)
	}

	function handleStatusChange(e: boolean, field: string) {
		const tmp = {...status}

		if (field === 'ativo') tmp.ativo = e
		if (field === 'aberto') tmp.aberto = e
		if (field === 'nome_sujo') tmp.nome_sujo = e

		setStatus(tmp)
	}

	// function handleConditionsChange(e: boolean, field: string)
	// {
	// 	let tmpConditions = {...condicoes}

	// 	if (field === 'prazo')
	// 		tmpConditions.prazo = e
	// 	if (field === 'vista')
	// 		tmpConditions.vista = e
	// 	if (field === 'cheque')
	// 		tmpConditions.cheque = e

	// 	setCondicoes(tmpConditions)
	// }

	function handleAddContact() {
		const tmpContacts = [...contatos, {nome: '', telefone: ''}]
		setContatos(tmpContacts)
	}

	function handleRemoveContact(index: number) {
		const tmpContacts = [...contatos]
		tmpContacts.splice(index, 1)
		setContatos(tmpContacts)
	}

	function handleContactChange(value: string, index: number, field: string) {
		const tmpContacts = [...contatos]

		if (field === 'nome') tmpContacts[index].nome = value
		else if (field === 'telefone') tmpContacts[index].telefone = value

		setContatos(tmpContacts)
	}

	async function handleSendCredentialsViaMail(pwd: string) {
		if (!sendCredentialsViaMail) return

		const text =
			'<p>Suas credenciais no e-commerce da <strong>Cruz Representações</strong> foram atualizadas!</p>' +
			'<p>A partir de agora, você pode fazer seu login em <a href="https://cruzrepresentacoes.com.br">cruzrepresentacoes.com.br</a> usando as seguintes informações:</p>' +
			'<br />' +
			`<span><strong>E-mail:</strong> ${email}</span><br />` +
			`<span><strong>Senha:</strong> ${pwd}</span>` +
			'<br />' +
			'<p>Mantenha sempre suas credenciais seguras!</p>' +
			'<br />' +
			'<h2>Cruz Representações</h2>' +
			'<h3>Excelência em Representação Comercial!</h3>'

		const data = {
			to: [email],
			subject: 'Novas credenciais | Cruz Representações',
			text
		}

		await api.post('/mail', data)
	}

	function getWhatsappText(pwd: string) {
		const whatsappText =
			'Suas credenciais no e-commerce da *Cruz Representações* foram atualizadas!' +
			'%0D%0A' +
			'A partir de agora, você pode fazer seu login em cruzrepresentacoes.com.br usando as seguintes informações:' +
			'%0D%0A' +
			'%0D%0A' +
			`*E-mail:* ${email}` +
			'%0D%0A' +
			`*Senha:* ${pwd}` +
			'%0D%0A' +
			'%0D%0A' +
			'Mantenha sempre suas credenciais seguras!' +
			'%0D%0A' +
			'%0D%0A' +
			'Cruz Representações' +
			'%0D%0A' +
			'Excelência em Representação Comercial!'

		return whatsappText
	}

	function validateFields() {
		if (razao_social === '')
			return {
				areFieldsValid: false,
				warning: 'Você precisa informar a razão social.'
			}

		if (nome_fantasia === '')
			return {
				areFieldsValid: false,
				warning: 'Você precisa informar o nome fantasia.'
			}

		if (cnpj === '')
			return {areFieldsValid: false, warning: 'Você precisa informar o CNPJ.'}

		if (insc_estadual === '')
			return {
				areFieldsValid: false,
				warning: 'Você precisa informar a inscrição estadual.'
			}

		if (email === '')
			return {
				areFieldsValid: false,
				warning: 'Você precisa informar o e-mail.'
			}

		if (senha === '')
			return {areFieldsValid: false, warning: 'Você precisa criar uma senha.'}

		return {areFieldsValid: true, warning: ''}
	}

	function handleSubmit() {
		const {areFieldsValid, warning} = validateFields()
		if (!areFieldsValid) return warningAlert('Dados inválidos!', warning)
		console.log('<< status >>', status)

		const data = new FormData()

		data.append('_id', handleObjectId())
		if (imagem) data.append('imagem', imagem)
		data.append('razao_social', razao_social)
		data.append('nome_fantasia', nome_fantasia)
		data.append('cnpj', cnpj)
		data.append('insc_estadual', insc_estadual)
		data.append('email', email)
		data.append('senha', senha)
		data.append('vendedores', JSON.stringify(vendedores))
		data.append('representadas', JSON.stringify(representadas))
		data.append('telefone', telefone)
		data.append('contatos', JSON.stringify(contatos))
		data.append('endereco', JSON.stringify(endereco))
		data.append('status', JSON.stringify(status))
		data.append('condicoes', JSON.stringify(condicoes))

		if (method === 'post') {
			api
				.post('clients', data)
				.then(() => {
					successAlert('Cliente criado com sucesso!')
					handleSendCredentialsViaMail(senha)
					back()
				})
				.catch(catchError)
		} else if (method === 'put') {
			api
				.put(`clients/${id}`, data)
				.then(() => {
					successAlert('Cliente atualizado com sucesso!')
					back()
				})
				.catch(catchError)
		}

		if (!navigator.onLine) back()
	}

	return (
		<Container onSubmit={e => e.preventDefault()}>
			<PasswordModal
				isOpen={isPasswordModalOpen}
				setIsOpen={setIsPasswordModalOpen}
				role="client"
				id={id}
				setPwd={method === 'post' ? setSenha : undefined}
				sendCredentialsViaMail={sendCredentialsViaMail}
				setSendCredentialsViaMail={setSendCredentialsViaMail}
				handleSendCredentialsViaMail={handleSendCredentialsViaMail}
				getWhatsappText={getWhatsappText}
			/>

			{/* imagem */}
			<div className="field">
				<label htmlFor="imagem">Imagem</label>
				<Dropzone
					name="imageFile"
					id="imageFile"
					onFileUploaded={setImagem}
					shownFileUrl={client && client.imagem}
				/>
			</div>
			{/* razao_social */}
			<div className="required field">
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
			<div className="required field">
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
			<div className="required field">
				<label htmlFor="cnpj">CNPJ</label>
				<input
					type="text"
					name="cnpj"
					id="cnpj"
					value={cnpj}
					onChange={e => setCnpj(e.target.value)}
				/>
			</div>
			{/* insc_estadual */}
			<div className="required field">
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
			<div className="required field">
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
			<div className="required field">
				<label htmlFor="senha">Senha</label>
				<button
					type="button"
					className="action"
					onClick={() => setIsPasswordModalOpen(true)}
				>
					{method === 'post' && 'Criar senha'}
					{method === 'put' && 'Mudar senha'}
				</button>
			</div>
			{/* vendedores */}
			<div className="field">
				<label htmlFor="vendedores">Vendedores</label>
				<Select
					name="vendedores"
					id="vendedores"
					value={sellerOptions.filter(option =>
						vendedores.includes(option.value)
					)}
					onChange={handleSellersChange}
					options={sellerOptions}
					hideSelectedOptions
					isMulti
					styles={selectStyles}
					placeholder="Selecione os vendedores"
				/>
			</div>
			{/* representadas */}
			<div className="field">
				<label htmlFor="representada">Representadas</label>
				<ul>
					{representadas.map((representada, index) => (
						<li key={index}>
							<div className="select">
								<Select
									name="representada"
									value={companyOptions.find(
										option => option.value === representada.id
									)}
									onChange={e => handleCompanyChange(e, index, 'id')}
									options={companyOptions}
									styles={selectStyles}
									placeholder="Selecione a representada"
								/>
							</div>
							<div className="select">
								<Select
									name="tabela"
									value={
										representada.id !== '' &&
										tableOptions[representada.id] &&
										tableOptions[representada.id].find(
											option => option.value === representada.tabela
										)
									}
									onChange={e => handleCompanyChange(e, index, 'tabela')}
									options={
										representada.id !== '' ? tableOptions[representada.id] : []
									}
									isDisabled={representada.id === ''}
									styles={selectStyles}
									placeholder={
										representada.id !== ''
											? 'Selecione a tabela'
											: 'Selecione a representada'
									}
								/>
							</div>
							<button type="button" onClick={() => handleRemoveCompany(index)}>
								<FiMinus />
								<span>Remover representada</span>
							</button>
						</li>
					))}
					<button type="button" onClick={handleAddCompany}>
						<FiPlus />
						<span>Adicionar representada</span>
					</button>
				</ul>
			</div>
			{/* telefone */}
			<div className="field">
				<label htmlFor="telefone">Telefone</label>
				<input
					type="text"
					name="telefone"
					id="telefone"
					value={telefone}
					onChange={e => setTelefone(e.target.value)}
				/>
			</div>
			{/* contatos */}
			<div className="field">
				<label>Contatos</label>
				<ul>
					{contatos.map((contato, index) => (
						<li key={index}>
							<input
								type="text"
								name="contato - nome"
								value={contato.nome}
								onChange={e =>
									handleContactChange(e.target.value, index, 'nome')
								}
								placeholder="Nome"
							/>
							<input
								type="text"
								name="contato - telefone"
								value={contato.telefone}
								onChange={e =>
									handleContactChange(e.target.value, index, 'telefone')
								}
								placeholder="Telefone"
							/>
							<button type="button" onClick={() => handleRemoveContact(index)}>
								<FiMinus />
								<span>Remover contato</span>
							</button>
						</li>
					))}
					<button type="button" onClick={handleAddContact}>
						<FiPlus />
						<span>Adicionar contato</span>
					</button>
				</ul>
			</div>
			{/* endereco */}
			<div className="field">
				<label>Endereço</label>
				<div className="addressField">
					<label htmlFor="rua">Rua</label>
					<input
						type="text"
						name="rua"
						id="rua"
						value={endereco.rua}
						onChange={e => handleAddressChange(e, 'rua')}
					/>
				</div>
				<div className="addressField">
					<label htmlFor="numero">Número</label>
					<input
						type="text"
						name="numero"
						id="numero"
						value={endereco.numero}
						onChange={e => handleAddressChange(e, 'numero')}
					/>
				</div>
				<div className="addressField">
					<label htmlFor="complemento">Complemento</label>
					<input
						type="text"
						name="complemento"
						id="complemento"
						value={endereco.complemento}
						onChange={e => handleAddressChange(e, 'complemento')}
					/>
				</div>
				<div className="addressField">
					<label htmlFor="bairro">Bairro</label>
					<input
						type="text"
						name="bairro"
						id="bairro"
						value={endereco.bairro}
						onChange={e => handleAddressChange(e, 'bairro')}
					/>
				</div>
				<div className="addressField">
					<label htmlFor="cep">CEP</label>
					<input
						type="string"
						name="cep"
						id="cep"
						value={endereco.cep}
						onChange={e => handleAddressChange(e, 'cep')}
					/>
				</div>
				<div className="addressField">
					<label htmlFor="cidade">Cidade</label>
					<input
						type="text"
						name="cidade"
						id="cidade"
						value={endereco.cidade}
						onChange={e => handleAddressChange(e, 'cidade')}
					/>
				</div>
				<div className="addressField">
					<label htmlFor="uf">UF</label>
					<input
						type="text"
						name="uf"
						id="uf"
						value={endereco.uf}
						onChange={e => handleAddressChange(e, 'uf')}
					/>
				</div>
			</div>
			{/* status */}
			<div className="field">
				<label htmlFor="status">Situação</label>
				<div className="switchFields">
					<div className="switchField">
						<span>ativo</span>
						<Switch
							name="ativo"
							id="ativo"
							checked={status.ativo}
							onChange={e => handleStatusChange(e, 'ativo')}
						/>
					</div>
					<div className="switchField">
						<span>aberto</span>
						<Switch
							name="aberto"
							id="aberto"
							checked={status.aberto}
							onChange={e => handleStatusChange(e, 'aberto')}
						/>
					</div>
					<div className="switchField">
						<span>nome sujo</span>
						<Switch
							name="nome_sujo"
							id="nome_sujo"
							checked={status.nome_sujo}
							onChange={e => handleStatusChange(e, 'nome_sujo')}
						/>
					</div>
				</div>
			</div>
			{/* condicoes */}
			{/* <div className='field'>
				<label htmlFor='condicoes'>Condições de compra</label>
				<div className='switchFields'>
					<div className='switchField'>
						<span>prazo</span>
						<Switch
							name='prazo'
							id='prazo'
							checked={condicoes.prazo}
							onChange={e => handleConditionsChange(e, 'prazo')}
						/>
					</div>
					<div className='switchField'>
						<span>à vista</span>
						<Switch
							name='vista'
							id='vista'
							checked={condicoes.vista}
							onChange={e => handleConditionsChange(e, 'vista')}
						/>
					</div>
					<div className='switchField'>
						<span>cheque</span>
						<Switch
							name='cheque'
							id='cheque'
							checked={condicoes.cheque}
							onChange={e => handleConditionsChange(e, 'cheque')}
						/>
					</div>
				</div>
			</div> */}

			<FormButtons handleCancel={back} handleSubmit={handleSubmit} />
		</Container>
	)
}

export default ClientForm
