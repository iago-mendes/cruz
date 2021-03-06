import {useRouter} from 'next/router'
import {ChangeEvent, useEffect, useState} from 'react'
import {FaWhatsapp} from 'react-icons/fa'
import Select from 'react-select'
import Switch from 'react-switch'
import {FiPlus, FiMinus} from 'react-icons/fi'

import Container from './styles'
import api from '../../services/api'
import {selectStyles} from '../../styles/select'
import Dropzone from '../Dropzone'
import FormButtons from '../FormButtons'
import successAlert from '../../utils/alerts/success'
import NumberInput from '../NumberInput'
import PasswordModal from '../_modals/Password'
import {companyController} from '../../services/offline/controllers/company'
import {catchError} from '../../utils/catchError'
import {handleObjectId} from '../../utils/handleObjectId'
import warningAlert from '../../utils/alerts/warning'

interface SellerNumber {
	numero: number
	whatsapp: boolean
}

interface SellerCompany {
	id: string
	comissao: number
}

export interface Seller {
	_id: string
	nome: string
	imagem: string
	telefones: SellerNumber[]
	email: string
	senha: string
	funcao: string
	admin: boolean
	representadas: SellerCompany[]
}

export interface ListedSeller {
	id: string
	imagem: string
	nome: string
	funcao: string
}

interface CompanyOption {
	value: string
	label: string
}

interface SellerFormProps {
	method: string

	nome: string
	setNome: (name: string) => void

	id?: string
	seller?: Seller
}

const SellerForm: React.FC<SellerFormProps> = ({
	method,
	nome,
	setNome,
	id,
	seller
}) => {
	const {back} = useRouter()

	const [imagem, setImagem] = useState<File>()
	const [telefones, setTelefones] = useState<SellerNumber[]>([])
	const [email, setEmail] = useState('')
	const [senha, setSenha] = useState('')
	const [funcao, setFuncao] = useState('')
	const [admin, setAdmin] = useState(false)
	const [representadas, setRepresentadas] = useState<SellerCompany[]>([])

	const [shownNumbers, setShownNumbers] = useState<string[]>([])
	const [companyOptions, setCompanyOptions] = useState<CompanyOption[]>([])

	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
	const [sendCredentialsViaMail, setSendCredentialsViaMail] = useState(false)

	useEffect(() => {
		if (seller) {
			setNome(seller.nome)
			setTelefones(seller.telefones)
			setEmail(seller.email)
			setSenha(seller.senha)
			setFuncao(seller.funcao)
			setAdmin(seller.admin)
			setRepresentadas(seller.representadas)

			setShownNumbers(
				seller.telefones.map(telefone => formatNumber(telefone.numero))
			)
		}
	}, [seller])

	useEffect(() => {
		companyController.raw().then(data => {
			const tmp: CompanyOption[] = []
			data.map(company =>
				tmp.push({
					value: company._id,
					label: `${company.nome_fantasia} (${company.razao_social})`
				})
			)

			setCompanyOptions(tmp)
		})
	}, [])

	function formatNumber(number: number | string) {
		const n = String(number)
		if (n.length === 10)
			return `(${n.substr(0, 2)}) ${n.substr(2, 4)}-${n.substr(6, 4)}`
		else return `(${n.substr(0, 2)}) ${n.substr(2, 5)}-${n.substr(7, 4)}`
	}

	function handleNumberChange(e: ChangeEvent<HTMLInputElement>, index: number) {
		const numbers = [...telefones]
		const formatedNumbers = [...shownNumbers]

		const number = e.target.value.replace(/\D/g, '')
		numbers[index] = {
			numero: Number(number),
			whatsapp: telefones[index].whatsapp
		}
		setTelefones(numbers)

		const formatedNumber = formatNumber(number)
		formatedNumbers[index] = formatedNumber
		setShownNumbers(formatedNumbers)
	}

	function handleWhatsappChange(isChecked: boolean, index: number) {
		const numbers = [...telefones]
		numbers[index].whatsapp = isChecked

		setTelefones(numbers)
	}

	function handleAddNumber() {
		setTelefones([...telefones, {numero: 0, whatsapp: false}])
		setShownNumbers([...shownNumbers, ''])
	}

	function handleRemoveNumber(index: number) {
		const numbers = [...telefones]
		numbers.splice(index, 1)
		setTelefones(numbers)

		const shown = [...shownNumbers]
		shown.splice(index, 1)
		setShownNumbers(shown)
	}

	function handleCompanyChange(e: CompanyOption, index: number) {
		const companies = [...representadas]
		companies[index].id = e.value

		setRepresentadas(companies)
	}

	function handleComissaoChange(n: number, index: number) {
		const companies = [...representadas]
		companies[index].comissao = n

		setRepresentadas(companies)
	}

	function handleAddCompany() {
		setRepresentadas([...representadas, {id: '', comissao: 0}])
	}

	function handleRemoveCompany(index: number) {
		const companies = [...representadas]
		companies.splice(index, 1)
		setRepresentadas(companies)
	}

	async function handleSendCredentialsViaMail(pwd: string) {
		if (!sendCredentialsViaMail) return

		const text =
			'<p>Suas credenciais no sistema da <strong>Cruz Representações</strong> foram atualizadas!</p>' +
			'<p>A partir de agora, você pode fazer seu login em <a href="https://sistema.cruzrepresentacoes.com.br">sistema.cruzrepresentacoes.com.br</a> usando as seguintes informações:</p>' +
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
			'Suas credenciais no sistema da *Cruz Representações* foram atualizadas!' +
			'%0D%0A' +
			'A partir de agora, você pode fazer seu login em sistema.cruzrepresentacoes.com.br usando as seguintes informações:' +
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
		if (nome === '')
			return {areFieldsValid: false, warning: 'Você precisa informar o nome.'}

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

		const data = new FormData()

		data.append('_id', handleObjectId())
		if (imagem) data.append('imagem', imagem)
		data.append('nome', nome)
		data.append('telefones', JSON.stringify(telefones))
		data.append('email', email)
		data.append('senha', senha)
		data.append('funcao', funcao)
		data.append('admin', String(admin))
		data.append('representadas', JSON.stringify(representadas))

		if (method === 'post') {
			api
				.post('sellers', data)
				.then(() => {
					successAlert('Vendedor criado com sucesso!')
					handleSendCredentialsViaMail(senha)
					back()
				})
				.catch(catchError)
		} else if (method === 'put') {
			api
				.put(`sellers/${id}`, data)
				.then(() => {
					successAlert('Vendedor atualizado com sucesso!')
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
				id={id}
				role="seller"
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
					shownFileUrl={seller && seller.imagem}
				/>
			</div>
			{/* nome */}
			<div className="required field">
				<label htmlFor="nome">Nome</label>
				<input
					type="text"
					name="nome"
					id="nome"
					value={nome}
					onChange={e => setNome(e.target.value)}
				/>
			</div>
			{/* telefone */}
			<div className="field">
				<label htmlFor="telefone">Telefones</label>
				<ul>
					{shownNumbers.map((number, index) => (
						<li key={index}>
							<div className="group">
								<input
									type="text"
									name="telefone"
									id="telefone"
									value={number}
									onChange={e => handleNumberChange(e, index)}
								/>
								<div className="whatsapp">
									<FaWhatsapp size={25} />
									<Switch
										checked={telefones[index].whatsapp}
										onChange={e => handleWhatsappChange(e, index)}
										height={25}
										width={50}
										onHandleColor="#d8d8d8"
										offHandleColor="#d8d8d8"
									/>
								</div>
							</div>
							<button type="button" onClick={() => handleRemoveNumber(index)}>
								-
							</button>
						</li>
					))}
					<button type="button" onClick={handleAddNumber}>
						+
					</button>
				</ul>
			</div>
			{/* email */}
			<div className="required field">
				<label htmlFor="email">E-mail</label>
				<input
					type="email"
					name="email"
					id="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
			</div>
			{/* senha */}
			<div className="required field">
				<label htmlFor="senha">Senha</label>
				<button className="action" onClick={() => setIsPasswordModalOpen(true)}>
					{method === 'post' && 'Criar senha'}
					{method === 'put' && 'Mudar senha'}
				</button>
			</div>
			{/* representadas */}
			<div className="long field">
				<label htmlFor="representadas">Representadas</label>
				<ul>
					{representadas.map((company, index) => (
						<li key={index}>
							<Select
								name="representadas"
								value={companyOptions.find(cmpn => cmpn.value === company.id)}
								onChange={e => handleCompanyChange(e, index)}
								options={companyOptions}
								styles={selectStyles}
								className="select"
								placeholder="Selecione uma representada"
							/>
							<div className="comissao">
								<span>Comissão:</span>
								<NumberInput
									value={company.comissao}
									setValue={n => handleComissaoChange(n, index)}
									name="comissao"
									placeholder="Ex.: 5.5%"
								/>
							</div>
							<button type="button" onClick={() => handleRemoveCompany(index)}>
								<FiMinus />
								<span>Remover</span>
							</button>
						</li>
					))}
					<button type="button" onClick={handleAddCompany}>
						<FiPlus />
						<span>Adicionar</span>
					</button>
				</ul>
			</div>
			{/* funcao */}
			<div className="field">
				<label htmlFor="funcao">Função</label>
				<input
					type="text"
					name="funcao"
					id="funcao"
					value={funcao}
					onChange={e => setFuncao(e.target.value)}
				/>
			</div>
			{/* admin */}
			<div className="required field">
				<label htmlFor="admin">Administrador</label>
				<Switch
					name="admin"
					id="admin"
					checked={admin}
					onChange={setAdmin}
					onHandleColor="#d8d8d8"
					offHandleColor="#d8d8d8"
				/>
			</div>

			<FormButtons handleCancel={back} handleSubmit={handleSubmit} />
		</Container>
	)
}

export default SellerForm
