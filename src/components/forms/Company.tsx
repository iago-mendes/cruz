import {useRouter} from 'next/router'
import {ChangeEvent, FormEvent, useEffect, useState} from 'react'

import Container from '../../styles/components/forms/Company'
import api from '../../services/api'

export interface Company
{
	_id: string
	imagem?: string
	razao_social: string
	nome_fantasia: string
	cnpj: string
	telefones: Array<number>
	email: string
	descricao_curta?: string
	descricao?: string
	site?: string
	comissao: {porcentagem: number, obs: Array<string>}
}

interface CompanyFormProps
{
	method: string
	
	nomeFantasia: string
	setNomeFantasia: Function
	
	id?: string
	company?: Company
}

const CompanyForm: React.FC<CompanyFormProps> = ({method, nomeFantasia, setNomeFantasia, id, company}) =>
{
	const Router = useRouter()
    
	const [shownNumbers, setShownNumbers] = useState<string[]>([])
	const [shownCnpj, setShownCnpj] = useState('')

	const [imagem, setImagem] = useState<File>()
	const [razaoSocial, setRazaoSocial] = useState('')
	const [cnpj, setCnpj] = useState(0)
	const [telefones, setTelefones] = useState([0])
	const [email, setEmail] = useState('')
	const [comissao, setComissao] = useState({porcentagem: 0.00, obs: ['']})
	const [descricaoCurta, setDescricaoCurta] = useState('')
	const [descricao, setDescricao] = useState('')
	const [site, setSite] = useState('')

	useEffect(() =>
	{
		if (company)
		{
			setRazaoSocial(company.razao_social)
			setNomeFantasia(company.nome_fantasia)
			setTelefones(company.telefones)
			setEmail(company.email)
			setComissao(company.comissao)
			setDescricaoCurta(company.descricao_curta)
			setDescricao(company.descricao)
			setSite(company.site)
			
			setTelefones(company.telefones)
			setShownNumbers(company.telefones.map(tel => formatNumber(tel)))

			setCnpj(Number(company.cnpj))
			setShownCnpj(formatCnpj(company.cnpj))
		}
	}, [company])

	function formatNumber(number: number | string)
	{
		const n = String(number)
		if (n.length === 10)
			return `(${n.substr(0, 2)}) ${n.substr(2, 4)}-${n.substr(6, 4)}`
		else
			return `(${n.substr(0, 2)}) ${n.substr(2, 5)}-${n.substr(7, 4)}`
	}

	function formatCnpj(number: number | string)
	{
		const n = String(number).replace(/\D/g,'')
		if (n.length === 14)
			return `${n.substr(0,2)}.${n.substr(2,3)}.${n.substr(5,3)}/${n.substr(8,4)}-${n.substr(12,2)}`
		else return n
	}

	function handleInputChange(e: ChangeEvent<HTMLInputElement>)
	{
		if (e.target.name === 'imagem') setImagem(e.target.files[0])
		if (e.target.name === 'razao_social') setRazaoSocial(e.target.value)
		if (e.target.name === 'nome_fantasia') setNomeFantasia(e.target.value)
		if (e.target.name === 'email') setEmail(e.target.value)
		if (e.target.name === 'descricao_curta') setDescricaoCurta(e.target.value)
		if (e.target.name === 'site') setSite(e.target.value)

		if (e.target.name === 'cnpj')
		{
			setCnpj(Number(e.target.value))
			setShownCnpj(formatCnpj(e.target.value))
		}
	}

	function handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>)
	{
		if (e.target.name === 'descricao') setDescricao(e.target.value)
	}

	function handleNumberChange(e: ChangeEvent<HTMLInputElement>, index: number)
	{
		let numbers = [...telefones]
		let formatedNumbers = [...shownNumbers]

		const number = e.target.value.replace(/\D/g,'')
		numbers[index] = Number(number)
		setTelefones(numbers)

		const formatedNumber = formatNumber(number)
		formatedNumbers[index] = formatedNumber
		setShownNumbers(formatedNumbers)
	}

	function handleComissaoChange(e: ChangeEvent<HTMLInputElement>, index = 0)
	{
		if (e.target.name === 'comissao_porcentagem')
		{
			const porcentagem = Number(e.target.value)
			setComissao({porcentagem, obs: [...comissao.obs]})
		}
		else if (e.target.name === 'comissao_obs')
		{
			let obs = [...comissao.obs]
			obs[index] = e.target.value
			setComissao({porcentagem: comissao.porcentagem, obs})
		}
	}

	function handleAddNumber()
	{
		setTelefones([...telefones, 0])
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
    
	function handleAddComissaoObs()
	{
		setComissao({porcentagem: comissao.porcentagem, obs: [...comissao.obs, '']})
	}

	function handleRemoveComissaoObs(index: number)
	{
		let obs = [...comissao.obs]
		obs.splice(index, 1)
		setComissao({porcentagem: comissao.porcentagem, obs})
	}

	async function handleSubmit(e: FormEvent)
	{
		e.preventDefault()

		const data = new FormData()

		if (imagem) data.append('imagem', imagem)
		data.append('razao_social', razaoSocial)
		data.append('nome_fantasia', nomeFantasia)
		data.append('cnpj', JSON.stringify(cnpj))
		data.append('telefones', JSON.stringify(telefones))
		data.append('email', email)
		data.append('comissao', JSON.stringify(comissao))
		data.append('descricao_curta', descricaoCurta)
		data.append('descricao', descricao)
		data.append('site', site)

		if (method === 'post')
		{
			await api.post('companies', data)
			.then(() =>
			{
				alert('Empresa criada com sucesso!')
				Router.back()
			})
			.catch(err =>
			{
				console.error(err)
				alert('Algo errado aconteceu!')
			})
		}
		else if (method === 'put')
		{
			await api.put(`companies/${id}`, data)
			.then(() =>
			{
				alert('Empresa atualizada com sucesso!')
				Router.back()
			})
			.catch(err =>
			{
				console.error(err)
				alert('Algo errado aconteceu!')
			})
		}
	}

	return (
		<Container onSubmit={handleSubmit} >
			<div>
				<label htmlFor="imagem">Imagem</label>
				<input type="file" name="imagem" id="imagem" onChange={handleInputChange}/>
			</div>
			<div>
				<label htmlFor="razao_social">Razão social</label>
				<input
					type="text"
					name="razao_social"
					id="razao_social"
					value={razaoSocial}
					onChange={handleInputChange}
				/>
			</div>
			<div>
				<label htmlFor="nome_fantasia">Nome fantasia</label>
				<input
					type="text"
					name="nome_fantasia"
					id="nome_fantasia"
					value={nomeFantasia}
					onChange={handleInputChange}
				/>
			</div>
			<div>
				<label htmlFor="cnpj">CNPJ</label>
				<input
					type="text"
					name="cnpj"
					id="cnpj"
					value={shownCnpj}
					onChange={handleInputChange}
					maxLength={18}
				/>
			</div>
			<div>
				<label htmlFor="telefone">Telefones</label>
				<ul>
					{shownNumbers.map((number, index) => (
						<li key={index} className="phone">
							<input
								type="text"
								name="telefone"
								id="telefone"
								value={number}
								onChange={(e) => handleNumberChange(e, index)}
							/>
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
					onChange={handleInputChange}
				/>
			</div>
			<div>
				<label htmlFor="comissao_porcentagem">Comissão - Porcentagem</label>
				<input
					type="number"
					name="comissao_porcentagem"
					id="comissao_porcentagem"
					value={comissao.porcentagem}
					onChange={(e) => handleComissaoChange(e)}
				/>
				<label htmlFor="comissao_obs">Comissão - Observações</label>
				<ul>
					{comissao.obs.map((obs, index) => (
						<li key={index} className="obs">
							<input
								type="text"
								name="comissao_obs"
								id="comissao_obs"
								value={obs}
								onChange={(e) => handleComissaoChange(e, index)}
							/>
							<button type="button" onClick={() => handleRemoveComissaoObs(index)} >-</button>
						</li>
					))}
					<button type="button" onClick={handleAddComissaoObs}>+</button>
				</ul>
			</div>
			<div>
				<label htmlFor="descricao_curta">Descrição curta</label>
				<input
					type="text"
					name="descricao_curta"
					id="descricao_curta"
					value={descricaoCurta}
					onChange={handleInputChange}
				/>
			</div>
			<div>
				<label htmlFor="descricao">Descrição</label>
				<textarea
					name="descricao"
					id="descricao"
					cols={30}
					rows={10}
					value={descricao}
					onChange={handleTextareaChange}
				/>
			</div>
			<div>
				<label htmlFor="site">Site</label>
				<input
					type="link"
					name="site"
					id="site"
					value={site}
					onChange={handleInputChange}
				/>
			</div>
			<div className="buttons">
				<button type="button" onClick={Router.back}>Cancelar</button>
				<button type="submit">Confirmar</button>
			</div>
		</Container>
	)
}

export default CompanyForm