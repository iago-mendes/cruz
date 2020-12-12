import {useRouter} from 'next/router'
import {ChangeEvent, FormEvent, useEffect, useState} from 'react'
import {FaWhatsapp} from 'react-icons/fa'
import Select from 'react-select'

import Container from '../../styles/components/forms/Seller'
import api from '../../services/api'
import {Company} from './Company'

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
	const Router = useRouter()
    
	const [imagem, setImagem] = useState<File>()
	const [telefones, setTelefones] = useState<SellerNumber[]>([])
	const [email, setEmail] = useState('')
	const [senha, setSenha] = useState('')
	const [funcao, setFuncao] = useState('')
	const [admin, setAdmin] = useState(false)
	const [representadas, setRepresentadas] = useState<SellerCompany[]>([])
	
	const [shownNumbers, setShownNumbers] = useState<string[]>([])
	const [companyOptions, setCompanyOptions] = useState<CompanyOption[]>([])

	useEffect(() =>
	{
		if (seller)
		{
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
		api.get('companies-all').then(({data}:{data: Company[]}) =>
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
		// let numbers = [...telefones]
		// let formatedNumbers = [...shownNumbers]

		// const number = e.target.value.replace(/\D/g,'')
		// numbers[index] = Number(number)
		// setTelefones(numbers)

		// const formatedNumber = formatNumber(number)
		// formatedNumbers[index] = formatedNumber
		// setShownNumbers(formatedNumbers)
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

	async function handleSubmit(e: FormEvent)
	{
		e.preventDefault()

		// const data = new FormData()

		// if (imagem) data.append('imagem', imagem)
		// data.append('razao_social', razaoSocial)
		// data.append('nome_fantasia', nomeFantasia)
		// data.append('cnpj', JSON.stringify(cnpj))
		// data.append('telefones', JSON.stringify(telefones))
		// data.append('email', email)
		// data.append('comissao', JSON.stringify(comissao))
		// data.append('descricao_curta', descricaoCurta)
		// data.append('descricao', descricao)
		// data.append('site', site)

		// if (method === 'post')
		// {
		// 	await api.post('companies', data)
		// 	.then(() =>
		// 	{
		// 		alert('Empresa criada com sucesso!')
		// 		Router.back()
		// 	})
		// 	.catch(err =>
		// 	{
		// 		console.error(err)
		// 		alert('Algo errado aconteceu!')
		// 	})
		// }
		// else if (method === 'put')
		// {
		// 	await api.put(`companies/${id}`, data)
		// 	.then(() =>
		// 	{
		// 		alert('Empresa atualizada com sucesso!')
		// 		Router.back()
		// 	})
		// 	.catch(err =>
		// 	{
		// 		console.error(err)
		// 		alert('Algo errado aconteceu!')
		// 	})
		// }
	}

	return (
		<Container onSubmit={handleSubmit} >
			<div>
				<label htmlFor="imagem">Imagem</label>
				<input
					type="file"
					name="imagem"
					id="imagem"
					onChange={e => setImagem(e.target.files[0])}
				/>
			</div>
			<div>
				<label htmlFor="nome">Nome</label>
				<input
					type="text"
					name="nome"
					id="nome"
					value={nome}
					onChange={e => setNome(e.target.value)}
				/>
			</div>
			<div>
				<label htmlFor="telefone">Telefones</label>
				<ul>
					{shownNumbers.map((number, index) => (
						<li key={index} className="phone">
							<div className='group' >
								<input
									type="text"
									name="telefone"
									id="telefone"
									value={number}
									onChange={(e) => handleNumberChange(e, index)}
								/>
								<div className='whatsapp'>
									<FaWhatsapp size={25} />
									<input type='check'/>
								</div>
							</div>
							<button type="button" onClick={() => handleRemoveNumber(index)}>-</button>
						</li>
					))}
					<button type="button" onClick={handleAddNumber}>+</button>
				</ul>
			</div>
			<div>
				<label htmlFor="email">E-mail</label>
				<input
					type="email"
					name="email"
					id="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
			</div>
			<div>
				<label htmlFor="senha">Senha</label>
				<input
					type="senha"
					name="senha"
					id="senha"
					value={senha}
					onChange={e => setSenha(e.target.value)}
				/>
			</div>
			<div>
				<label htmlFor="funcao">Função</label>
				<input
					type="text"
					name="funcao"
					id="funcao"
					value={funcao}
					onChange={e => setFuncao(e.target.value)}
				/>
			</div>
			<div>
				<label htmlFor="admin">Administrador</label>
				<input
					type="check"
					name="admin"
					id="admin"
					// value={admin}
					// onChange={e => setAdmin(e.target.value)}
				/>
			</div>
			<div>
				<label htmlFor="representadas">Representadas</label>
				<Select
					name="representadas"
					id="representadas"
					// value={companyOptions.filter(company => representadas.)}
					// onChange={() => {}}
					options={companyOptions}
				/>
			</div>
			<div className="buttons">
				<button type="button" onClick={Router.back}>Cancelar</button>
				<button type="submit">Confirmar</button>
			</div>
		</Container>
	)
}

export default SellerForm