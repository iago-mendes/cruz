import {useRouter} from 'next/router'
import Select from 'react-select'
import {useEffect, useState} from 'react'
import Switch from 'react-switch'
import {FiPlus, FiX} from 'react-icons/fi'

import freteOptions from '../../assets/db/options/frete.json'
import typeOptions from '../../assets/db/options/type.json'

import Container from './styles'
import {selectStyles} from '../../styles/global'
import useAuth from '../../hooks/useAuth'
import RawProduct from '../../models/product'
import SelectProductsModal from '../modals/SelectProducts'
import {SelectOption} from '../../utils/types'
import getDate from '../../utils/getDate'
import Request, {
	defaultSelected,
	RequestProduct,
	Selected,
	Status,
	Type
} from '../../models/request'
import {CompanyCondition} from '../../models/company'
import SelectClientModal from '../modals/SelectClient'
import api from '../../services/api'
import successAlert from '../../utils/alerts/success'
import {sellerController} from '../../services/offline/controllers/seller'
import {companyController} from '../../services/offline/controllers/company'
import {clientController} from '../../services/offline/controllers/client'
import {catchError} from '../../utils/catchError'
import RequestSummaryModal from '../modals/RequestSummary'
import warningAlert from '../../utils/alerts/warning'
import EditRequestProductModal from '../modals/EditRequestProduct'
import SendRequestEmailModal from '../modals/SendRequestEmail'
import {ClientContact} from '../../models/client'
import {handleObjectId} from '../../utils/handleObjectId'
import Header from '../Header'
import LoadingModal from '../../components/modals/Loading'
import {handleDeleteRequest} from '../../utils/requests/handleDeleteRequest'
import {handleSeeRequestPDF} from '../../utils/requests/handleSeeRequestPDF'

type RawProductsList = {
	[companyId: string]: RawProduct[]
}

type RequestFormProps = {
	method: string

	id?: string
	request?: Request
}

const RequestForm: React.FC<RequestFormProps> = ({method, id, request}) => {
	const {back, push, query} = useRouter()
	const {user, loading} = useAuth()

	const [cliente, setCliente] = useState('')
	const [vendedor, setVendedor] = useState('')
	const [representada, setRepresentada] = useState('')
	const [produtos, setProdutos] = useState<RequestProduct[]>([])
	const [data, setData] = useState(getDate(true))
	const [condicao, setCondicao] = useState('')
	const [frete, setFrete] = useState(freteOptions[0].value)
	const [contato, setContato] = useState<ClientContact>({
		nome: '',
		telefone: ''
	})
	const [digitado_por, setDigitadoPor] = useState('')
	const [tipo, setTipo] = useState<Type>({venda: true, troca: false})
	const [status, setStatus] = useState<Status>({
		concluido: false,
		enviado: false,
		faturado: false
	})
	const [obs, setObs] = useState('')

	const [sellerOptions, setSellerOptions] = useState<SelectOption[]>([])
	const [companyOptions, setCompanyOptions] = useState<SelectOption[]>([])
	const [conditionOptions, setConditionOptions] = useState<CompanyCondition[]>(
		[]
	)
	const [contactOptions, setContactOptions] = useState<ClientContact[]>([])

	const [rawProductsList, setRawProductsList] = useState<RawProductsList>({})
	const [selected, setSelected] = useState<Selected>(defaultSelected)
	const [clientData, setClientData] = useState('')

	const [isAddingNewContact, setIsAddingNewContact] = useState(false)
	const [newContactName, setNewContactName] = useState('')
	const [newContactPhone, setNewContactPhone] = useState('')
	const [isSavingNewContact, setIsSavingNewContact] = useState(true)

	const [isSelectProductsModalOpen, setIsSelectProductsModalOpen] =
		useState(false)
	const [isSelectClientModalOpen, setIsSelectClientModalOpen] = useState(false)
	const [isEditRequestProductModalOpen, setIsEditRequestProductModalOpen] =
		useState(false)
	const [isSendRequestEmailModalOpen, setIsSendRequestEmailModalOpen] =
		useState(false)
	const [isRequestSummaryExpanded, setIsRequestSummaryExpanded] =
		useState(false)

	const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false)

	const conditionSelectOptions = conditionOptions
		// .filter(option => option.precoMin <= calcTotal())
		.sort((a, b) => (a.precoMin < b.precoMin ? -1 : 1))
		.map(option => ({label: option.nome, value: option.nome}))

	const contactSelectOptions = contactOptions.map(option => ({
		label: `${option.nome} | ${option.telefone}`,
		value: `${option.nome}__${option.telefone}`
	}))

	useEffect(() => {
		async function getSellers() {
			const sellers = await sellerController.raw()
			const tmpSellerOptions: SelectOption[] = sellers.map(seller => ({
				label: seller.nome,
				value: seller._id
			}))

			setSellerOptions(tmpSellerOptions)
		}

		async function getCompaniesAndRawProductsList() {
			const companies = await companyController.raw()
			const tmpRawProductsList: RawProductsList = {}

			const tmpCompanyOptions: SelectOption[] = companies.map(company => {
				tmpRawProductsList[company._id] = company.produtos

				return {
					label: company.nome_fantasia,
					value: company._id
				}
			})

			setCompanyOptions(tmpCompanyOptions)
			setRawProductsList(tmpRawProductsList)
		}

		getSellers()
		getCompaniesAndRawProductsList()
	}, [])

	useEffect(() => {
		if (!loading) setVendedor(user.id)
	}, [loading, user])

	useEffect(() => {
		async function updateTable() {
			if (cliente !== '' && representada !== '') {
				const tmpSelected = {...selected}
				const client = await clientController.rawOne(cliente)

				const clientCompany = client.representadas.find(
					({id}) => id === representada
				)
				if (clientCompany) {
					tmpSelected.clientCompanyTableId = clientCompany.tabela
					setSelected(tmpSelected)
				}

				const tmpContactOptions = client.contatos
				setContactOptions(tmpContactOptions)
			}
		}

		updateTable()
	}, [cliente, representada])

	useEffect(() => {
		if (request) {
			setCliente(request.cliente)
			setVendedor(request.vendedor)
			setRepresentada(request.representada)
			setProdutos(request.produtos)
			setData(request.data)
			setCondicao(request.condicao)
			setFrete(request.frete)
			setContato(request.contato)
			setDigitadoPor(request.digitado_por)
			setTipo(request.tipo)
			setStatus(request.status)
			setObs(request.obs || '')

			if (request.cliente !== '')
				clientController.rawOne(request.cliente).then(client => {
					const tmpClientData = `${client.nome_fantasia} | ${client.razao_social}`
					setClientData(tmpClientData)
				})

			if (request.representada !== '')
				companyController.rawOne(request.representada).then(company => {
					if (company) setConditionOptions(company.condicoes)
				})

			const tmpSelected = {...selected}
			tmpSelected.clientId = request.cliente
			tmpSelected.companyId = request.representada
			setSelected(tmpSelected)
		}
	}, [request])

	useEffect(() => {
		const step = String(query.step)

		if (step === 'cliente') {
			setIsSelectClientModalOpen(true)
			setIsSelectProductsModalOpen(false)
			setIsEditRequestProductModalOpen(false)
		} else if (step === 'produtos') {
			setIsSelectProductsModalOpen(true)
			setIsSelectClientModalOpen(false)
			setIsEditRequestProductModalOpen(false)
		} else if (step === 'produto') {
			setIsEditRequestProductModalOpen(true)
			setIsSelectClientModalOpen(false)
			setIsSelectProductsModalOpen(false)
		} else {
			setIsSelectClientModalOpen(false)
			setIsSelectProductsModalOpen(false)
			setIsEditRequestProductModalOpen(false)
		}
	}, [query.step])

	async function handleSelectClient(id: string) {
		setCliente(id)
		setProdutos([])

		const tmpSelected = {...selected}
		tmpSelected.clientId = id
		setSelected(tmpSelected)

		const client = await clientController.rawOne(id)
		const tmpClientData = `${client.nome_fantasia} | ${client.razao_social}`
		setClientData(tmpClientData)
	}

	function handleSelectSeller(e: SelectOption) {
		setVendedor(e.value)
	}

	async function handleSelectCompany(e: SelectOption) {
		const companyId = e.value

		setRepresentada(companyId)
		setProdutos([])

		const tmpSelected = {...selected}
		tmpSelected.companyId = companyId
		setSelected(tmpSelected)

		const company = await companyController.rawOne(companyId)
		setConditionOptions(company.condicoes)
	}

	function handleTypeChange(e: SelectOption) {
		const tmpType = {
			venda: e.value === 'venda',
			troca: e.value === 'troca'
		}

		setTipo(tmpType)
	}

	function getTypeValue() {
		let typeAlt = ''

		if (tipo.venda) typeAlt = 'venda'
		else if (tipo.troca) typeAlt = 'troca'

		const value = typeOptions.find(option => option.value === typeAlt)
		return value
	}

	function handleStatusChange(e: boolean, field: string) {
		const tmp = {...status}

		if (field === 'concluido') tmp.concluido = e
		if (field === 'enviado') tmp.enviado = e
		if (field === 'faturado') tmp.faturado = e

		setStatus(tmp)
	}

	function handleSelectProducts() {
		if (cliente === '' || representada === '')
			return warningAlert(
				'Detalhes faltando...',
				'Você precisa selecionar um cliente e uma representada.'
			)

		setModalState(true, 'produtos')
	}

	function handleEditProduct(product: RequestProduct) {
		const tmpSelected = {...selected}
		tmpSelected.product = product
		setSelected(tmpSelected)

		setModalState(true, 'produto')
	}

	function handleGenerateRequest() {
		const statusAlt = {...status}
		statusAlt.concluido = true

		handleSubmit(statusAlt)
	}

	function handleSendRequest() {
		const statusAlt = {...status}
		statusAlt.enviado = true

		handleSubmit(statusAlt, false)
	}

	function handleSelectContact(e: SelectOption) {
		const [nome, telefone] = e.value.split('__')

		const tmpContact = {
			nome,
			telefone
		}

		setContato(tmpContact)
	}

	function setModalState(state: boolean, step?: string) {
		const base = method === 'put' ? `/pedidos/${id}` : '/pedidos/novo'

		if (state === true && step) push(`${base}?step=${step}`)
		else back()
	}

	function getOptions() {
		const options: Array<{
			display: string
			action: () => void
			color?: string
		}> = []

		options.push({display: 'Salvar', action: () => handleSubmit()})

		if (!status.concluido)
			options.push({display: 'Gerar pedido', action: handleGenerateRequest})

		if (request && request._id !== '' && !request._id.includes('tmpId'))
			options.push({
				display: 'Enviar por e-mail',
				action: () => setIsSendRequestEmailModalOpen(true)
			})

		if (request && request._id !== '')
			options.push({
				display: 'Ver em PDF',
				action: () => handleSeeRequestPDF(request._id, setIsLoadingModalOpen)
			})

		if (method === 'post')
			options.push({
				display: 'Cancelar orçamento',
				action: back,
				color: '#f00'
			})
		else if (method === 'put')
			options.push({
				display: 'Deletar pedido',
				action: () => handleDeleteRequest(request._id, request.data, back),
				color: '#f00'
			})

		return options
	}

	function validateFields() {
		if (cliente === '')
			return {
				areFieldsValid: false,
				warning: 'Você precisa selecionar um cliente.'
			}

		if (representada === '')
			return {
				areFieldsValid: false,
				warning: 'Você precisa selecionar uma representada.'
			}

		if (produtos.length === 0)
			return {
				areFieldsValid: false,
				warning: 'Você precisa selecionar pelo menos um produto.'
			}

		if (data === '')
			return {
				areFieldsValid: false,
				warning: 'Você precisa selecionar uma data.'
			}

		if (condicao === '')
			return {
				areFieldsValid: false,
				warning: 'Você precisa selecionar uma condição de pagamento.'
			}

		if (tipo === {venda: false, troca: false})
			return {
				areFieldsValid: false,
				warning: 'Você precisa selecionar um tipo de pedido.'
			}

		return {areFieldsValid: true, warning: ''}
	}

	function handleSubmit(statusAlt?: Status, showSuccessAlert = true) {
		const {areFieldsValid, warning} = validateFields()
		if (!areFieldsValid) return warningAlert('Dados inválidos!', warning)

		const contact = isAddingNewContact
			? {nome: newContactName, telefone: newContactPhone}
			: contato

		const apiData = {
			_id: handleObjectId(),
			cliente,
			vendedor,
			representada,
			produtos,
			data,
			condicao,
			frete,
			contato: contact,
			digitado_por,
			tipo,
			status: statusAlt ? statusAlt : status,
			obs
		}

		if (method === 'post') {
			api
				.post('requests', apiData)
				.then(() => {
					if (showSuccessAlert) successAlert('Pedido criado com sucesso!')
					back()
				})
				.catch(catchError)
		} else if (method === 'put') {
			api
				.put(`requests/${id}`, apiData)
				.then(() => {
					if (showSuccessAlert) successAlert('Pedido atualizado com sucesso!')
					back()
				})
				.catch(catchError)
		}

		if (isAddingNewContact && isSavingNewContact) {
			const data = {
				nome: newContactName,
				telefone: newContactPhone
			}

			api.post(`clients/${cliente}/contacts`, data)
		}

		if (!navigator.onLine) back()
	}

	return (
		<>
			<Header
				display={method === 'post' ? 'Novo pedido' : 'Pedidos > Editar'}
				options={getOptions()}
			/>

			<main className="main">
				<Container onSubmit={e => e.preventDefault()}>
					<SelectProductsModal
						isOpen={isSelectProductsModalOpen}
						setIsOpen={isOpen => setModalState(isOpen, 'produtos')}
						selected={selected}
						products={produtos}
						setProducts={setProdutos}
						editProduct={handleEditProduct}
					/>

					<EditRequestProductModal
						isOpen={isEditRequestProductModalOpen}
						setIsOpen={isOpen => setModalState(isOpen, 'produto')}
						selected={selected}
						setSelected={setSelected}
						products={produtos}
						setProducts={setProdutos}
					/>

					<SelectClientModal
						isOpen={isSelectClientModalOpen}
						setIsOpen={isOpen => setModalState(isOpen, 'cliente')}
						setClient={handleSelectClient}
					/>

					<RequestSummaryModal
						isExpanded={isRequestSummaryExpanded}
						setIsExpanded={setIsRequestSummaryExpanded}
						companyId={representada}
						products={produtos}
						setProducts={setProdutos}
						rawProductsList={rawProductsList}
						editProduct={handleEditProduct}
					/>

					<SendRequestEmailModal
						isOpen={isSendRequestEmailModalOpen}
						setIsOpen={setIsSendRequestEmailModalOpen}
						request={request}
						callback={handleSendRequest}
					/>

					<LoadingModal isOpen={isLoadingModalOpen} />

					{/* cliente */}
					<div className="required field">
						<label htmlFor="cliente">Cliente</label>
						<span className="modalResult">{clientData}</span>
						<button
							className="action"
							onClick={() => setModalState(true, 'cliente')}
						>
							{method === 'post' && 'SELECIONAR CLIENTE'}

							{method === 'put' && 'ALTERAR CLIENTE'}
						</button>
					</div>
					{/* vendedor */}
					<div className="field">
						<label htmlFor="vendedor">Vendedor</label>
						<Select
							name="vendedor"
							id="vendedor"
							value={sellerOptions.find(option => option.value === vendedor)}
							onChange={handleSelectSeller}
							options={sellerOptions}
							styles={selectStyles}
							placeholder="Selecione o vendedor"
							isSearchable={false}
						/>
					</div>
					{/* representada */}
					<div className="required field">
						<label htmlFor="representada">Representada</label>
						<Select
							name="representada"
							id="representada"
							value={companyOptions.find(
								option => option.value === representada
							)}
							onChange={handleSelectCompany}
							options={companyOptions}
							styles={selectStyles}
							placeholder="Selecione a representada"
							isSearchable={false}
						/>
					</div>
					{/* produtos */}
					<div className="required field">
						<label htmlFor="produtos">Produtos</label>
						<button className="action strong" onClick={handleSelectProducts}>
							SELECIONAR PRODUTOS
						</button>
						<button
							className="action detail"
							onClick={() => setIsRequestSummaryExpanded(true)}
						>
							VER ITENS SELECIONADOS
						</button>
					</div>

					{/* data */}
					<div className="required field">
						<label htmlFor="data">Data</label>
						<input
							type="date"
							name="data"
							id="data"
							value={data}
							onChange={e => setData(e.target.value)}
						/>
					</div>
					{/* condicao */}
					<div className="required field">
						<label htmlFor="condicao">Condição</label>
						<Select
							value={conditionSelectOptions.find(
								option => option.label === condicao
							)}
							options={conditionSelectOptions}
							onChange={e => setCondicao(e.value)}
							styles={selectStyles}
							placeholder="Condição de pagamento"
							isSearchable={false}
						/>
					</div>
					{/* frete */}
					<div className="field">
						<label htmlFor="frete">Frete</label>
						<Select
							value={freteOptions.find(option => option.label === frete)}
							options={freteOptions}
							onChange={e => setFrete(e.value)}
							styles={selectStyles}
							placeholder="Escolha uma opção de frete"
							isSearchable={false}
						/>
					</div>
					{/* contato */}
					<div className="field contact">
						<label>Contato</label>
						{!isAddingNewContact && (
							<>
								<Select
									value={contactSelectOptions.find(
										option =>
											option.value === `${contato.nome}__${contato.telefone}`
									)}
									options={contactSelectOptions}
									onChange={handleSelectContact}
									styles={selectStyles}
									placeholder="Contato"
									isSearchable={false}
								/>

								<button
									className="action"
									onClick={() => setIsAddingNewContact(true)}
								>
									<FiPlus />
									<span>Novo contato</span>
								</button>
							</>
						)}

						{isAddingNewContact && (
							<>
								<button
									className="action"
									onClick={() => setIsAddingNewContact(false)}
								>
									<FiX />
									<span>Cancelar</span>
								</button>

								<div className="newContactFields">
									<input
										type="text"
										name="nome"
										placeholder="Nome"
										value={newContactName}
										onChange={e => setNewContactName(e.target.value)}
									/>
									<input
										type="text"
										name="telefone"
										placeholder="Telefone"
										value={newContactPhone}
										onChange={e => setNewContactPhone(e.target.value)}
									/>
								</div>

								<div className="newContactSave">
									<Switch
										checked={isSavingNewContact}
										onChange={e => setIsSavingNewContact(e)}
									/>
									<span>Salvar contato</span>
								</div>
							</>
						)}
					</div>
					{/* digitado_por */}
					<div className="field">
						<label htmlFor="digitado_por">Digitado por</label>
						<input
							type="text"
							name="digitado_por"
							id="digitado_por"
							value={digitado_por}
							onChange={e => setDigitadoPor(e.target.value)}
						/>
					</div>
					{/* tipo */}
					<div className="required field">
						<label htmlFor="tipo">Tipo</label>
						<Select
							value={getTypeValue()}
							options={typeOptions}
							onChange={handleTypeChange}
							styles={selectStyles}
							isSearchable={false}
						/>
					</div>
					{/* obs */}
					<div className="field textareaField">
						<label htmlFor="obs">Observação</label>
						<textarea
							name="obs"
							id="obs"
							cols={30}
							rows={5}
							value={obs}
							onChange={e => setObs(e.target.value)}
						/>
					</div>
					{/* status */}
					<div className="field">
						<label htmlFor="status">Situação</label>
						<div className="switchFields">
							<div className="switchField">
								<span>Concluído</span>
								<Switch
									name="concluido"
									id="concluido"
									checked={status.concluido}
									onChange={e => handleStatusChange(e, 'concluido')}
									onHandleColor="#d8d8d8"
									offHandleColor="#d8d8d8"
								/>
							</div>
							<div className="switchField">
								<span>Enviado</span>
								<Switch
									name="enviado"
									id="enviado"
									checked={status.enviado}
									onChange={e => handleStatusChange(e, 'enviado')}
									onHandleColor="#d8d8d8"
									offHandleColor="#d8d8d8"
								/>
							</div>
							<div className="switchField">
								<span>Faturado</span>
								<Switch
									name="faturado"
									id="faturado"
									checked={status.faturado}
									onChange={e => handleStatusChange(e, 'faturado')}
									onHandleColor="#d8d8d8"
									offHandleColor="#d8d8d8"
								/>
							</div>
						</div>
					</div>

					<div className="formButtons">
						<button type="button" onClick={back}>
							Cancelar
						</button>
						<button type="submit" onClick={() => handleSubmit()}>
							Salvar
						</button>
						{request && request._id !== '' && !request._id.includes('tmpId') && (
							<button
								type="button"
								onClick={() => setIsSendRequestEmailModalOpen(true)}
							>
								Enviar e-mail
							</button>
						)}
						{!status.concluido && (
							<button type="button" onClick={handleGenerateRequest}>
								Gerar pedido
							</button>
						)}
					</div>
				</Container>
			</main>
		</>
	)
}

export default RequestForm
