import {useRouter} from 'next/router'
import {ChangeEvent, useEffect, useState} from 'react'
import {FaWhatsapp} from 'react-icons/fa'
import Select from 'react-select'
import Switch from 'react-switch'

import Container from '../../styles/components/forms/global'
import api from '../../services/api'
import Company from '../../models/company'
import {selectStyles} from '../../styles/global'
import Dropzone from '../Dropzone'
import FormButtons from '../FormButtons'
import successAlert from '../../utils/alerts/success'
import errorAlert from '../../utils/alerts/error'
import NumberInput from '../NumberInput'
import PasswordModal from '../modals/Password'

interface SellerNumber
{
	numero: number
	whatsapp: boolean
}

interface SellerCompany
{
	id: string
	comissao: number
}

export interface Seller
{
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

export interface ListedSeller
{
	id: string
	imagem: string
	nome: string
	funcao: string
}

interface CompanyOption
{
	value: string
	label: string
}

interface SellerFormProps
{
	method: string
	
	nome: string
	setNome: Function
	
	id?: string
	seller?: Seller
}

const SellerForm: React.FC<SellerFormProps> = ({method, nome, setNome, id, seller}) =>
{
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

	useEffect(() =>
	{
		if (seller)
		{
			setNome(seller.nome)
			setTelefones(seller.telefones)
			setEmail(seller.email)
			setSenha(seller.senha)
			setFuncao(seller.funcao)
			setAdmin(seller.admin)
			setRepresentadas(seller.representadas)

			setShownNumbers(seller.telefones.map(telefone => formatNumber(telefone.numero)))
		}
	}, [seller])

	useEffect(() =>
	{
		api.get('companies/raw').then(({data}:{data: Company[]}) =>
		{
			let tmp: CompanyOption[] = []
			data.map(company => tmp.push(
			{
				value: company._id,
				label: `${company.nome_fantasia} (${company.razao_social})`
			}))

			setCompanyOptions(tmp)
		})
	}, [])

	function formatNumber(number: number | string)
	{
		const n = String(number)
		if (n.length === 10)
			return `(${n.substr(0, 2)}) ${n.substr(2, 4)}-${n.substr(6, 4)}`
		else
			return `(${n.substr(0, 2)}) ${n.substr(2, 5)}-${n.substr(7, 4)}`
	}

	function handleNumberChange(e: ChangeEvent<HTMLInputElement>, index: number)
	{
		let numbers = [...telefones]
		let formatedNumbers = [...shownNumbers]

		const number = e.target.value.replace(/\D/g,'')
		numbers[index] = {numero: Number(number), whatsapp: telefones[index].whatsapp}
		setTelefones(numbers)

		const formatedNumber = formatNumber(number)
		formatedNumbers[index] = formatedNumber
		setShownNumbers(formatedNumbers)
	}

	function handleWhatsappChange(isChecked: boolean, index: number)
	{
		let numbers = [...telefones]
		numbers[index].whatsapp = isChecked

		setTelefones(numbers)
	}

	function handleAddNumber()
	{
		setTelefones([...telefones, {numero: 0, whatsapp: false}])
		setShownNumbers([...shownNumbers, ''])
	}

	function handleRemoveNumber(index: number)
	{
		let numbers = [...telefones]
		numbers.splice(index, 1)
		setTelefones(numbers)

		let shown = [...shownNumbers]
		shown.splice(index, 1)
		setShownNumbers(shown)
	}

	function handleCompanyChange(e: CompanyOption, index: number)
	{
		let companies = [...representadas]
		companies[index].id = e.value

		setRepresentadas(companies)
	}

	function handleComissaoChange(n: number, index: number)
	{
		let companies = [...representadas]
		companies[index].comissao = n

		setRepresentadas(companies)
	}

	function handleAddCompany()
	{
		setRepresentadas([...representadas, {id: '', comissao: 0}])
	}

	function handleRemoveCompany(index: number)
	{
		let companies = [...representadas]
		companies.splice(index, 1)
		setRepresentadas(companies)
	}

	async function handleSubmit()
	{
		const data = new FormData()

		if (imagem) data.append('imagem', imagem)
		data.append('nome', nome)
		data.append('telefones', JSON.stringify(telefones))
		data.append('email', email)
		data.append('senha', senha)
		data.append('funcao', funcao)
		data.append('admin', String(admin))
		data.append('representadas', JSON.stringify(representadas))

		if (method === 'post')
		{
			await api.post('sellers', data)
			.then(() =>
			{
				successAlert('Vendedor criado com sucesso!')
				back()
			})
			.catch(err =>
			{
				console.error(err)
				errorAlert('Algo errado aconteceu!')
			})
		}
		else if (method === 'put')
		{
			await api.put(`sellers/${id}`, data)
			.then(() =>
			{
				successAlert('Vendedor atualizado com sucesso!')
				back()
			})
			.catch(err =>
			{
				console.error(err)
				errorAlert('Algo errado aconteceu!')
			})
		}
	}

	return (
		<Container
			onSubmit={e => e.preventDefault()}
		>
			<PasswordModal
				isOpen={isPasswordModalOpen}
				setIsOpen={setIsPasswordModalOpen}

				role='seller'
				setPwd={method === 'post' ? setSenha : undefined}
			/>

			{/* imagem */}
			<div className='field'>
				<label htmlFor='imagem'>Imagem</label>
				<Dropzone
					name='imageFile'
					id='imageFile'
					onFileUploaded={setImagem}
					shownFileUrl={seller && seller.imagem}
				/>
			</div>
			{/* nome */}
			<div className='field'>
				<label htmlFor='nome'>Nome</label>
				<input
					type='text'
					name='nome'
					id='nome'
					value={nome}
					onChange={e => setNome(e.target.value)}
				/>
			</div>
			{/* telefone */}
			<div className='field'>
				<label htmlFor='telefone'>Telefones</label>
				<ul>
					{shownNumbers.map((number, index) => (
						<li key={index} >
							<div className='group' >
								<input
									type='text'
									name='telefone'
									id='telefone'
									value={number}
									onChange={(e) => handleNumberChange(e, index)}
								/>
								<div className='whatsapp'>
									<FaWhatsapp size={25} />
									<Switch
										checked={telefones[index].whatsapp}
										onChange={e => handleWhatsappChange(e, index)}
										height={25}
										width={50}
										onHandleColor='#d8d8d8'
										offHandleColor='#d8d8d8'
									/>
								</div>
							</div>
							<button type='button' onClick={() => handleRemoveNumber(index)}>-</button>
						</li>
					))}
					<button type='button' onClick={handleAddNumber}>+</button>
				</ul>
			</div>
			{/* email */}
			<div className='field'>
				<label htmlFor='email'>E-mail</label>
				<input
					type='email'
					name='email'
					id='email'
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
			</div>
			{/* senha */}
			<div className='field'>
				<label htmlFor='senha'>Senha</label>
				<button className='password' onClick={() => setIsPasswordModalOpen(true)} >
					{method === 'post' && 'Criar senha'}
					{method === 'put' && 'Mudar senha'}
				</button>
			</div>
			{/* representadas */}
			<div className='field'>
				<label htmlFor='representadas'>Representadas</label>
				<ul>
					{representadas.map((company, index) => (
						<li key={index} >
							<Select
								name='representadas'
								value={companyOptions.find(cmpn => cmpn.value === company.id)}
								onChange={e => handleCompanyChange(e, index)}
								options={companyOptions}
								styles={selectStyles}
								className='select'
								placeholder='Selecione uma representada'
							/>
							<div className='comissao' >
								<span>Comissão:</span>
								<NumberInput
									value={company.comissao}
									setValue={n => handleComissaoChange(n, index)}

									name='comissao'
									placeholder='Porcentagem'
								/>
							</div>
							<button type='button' onClick={() => handleRemoveCompany(index)}>-</button>
						</li>
					))}
					<button type='button' onClick={handleAddCompany}>+</button>
				</ul>
			</div>
			{/* funcao */}
			<div className='field'>
				<label htmlFor='funcao'>Função</label>
				<input
					type='text'
					name='funcao'
					id='funcao'
					value={funcao}
					onChange={e => setFuncao(e.target.value)}
				/>
			</div>
			{/* admin */}
			<div className='field'>
				<label htmlFor='admin'>Administrador</label>
				<Switch
					name='admin'
					id='admin'
					checked={admin}
					onChange={setAdmin}
					onHandleColor='#d8d8d8'
					offHandleColor='#d8d8d8'
				/>
			</div>

			<FormButtons
				handleCancel={back}
				handleSubmit={handleSubmit}
			/>
		</Container>
	)
}

export default SellerForm