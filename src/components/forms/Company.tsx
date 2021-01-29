import {useRouter} from 'next/router'
import {ChangeEvent, FormEvent, useEffect, useState} from 'react'

import Container from '../../styles/components/forms/global'
import api from '../../services/api'
import Company, {CompanyTable} from '../../models/company'
import Dropzone from '../Dropzone'

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
	const [telefones, setTelefones] = useState([])
	const [email, setEmail] = useState('')
	const [comissao, setComissao] = useState({porcentagem: 0.00, obs: []})
	const [descricaoCurta, setDescricaoCurta] = useState('')
	const [descricao, setDescricao] = useState('')
	const [site, setSite] = useState('')
	const [tabelas, setTabelas] = useState<CompanyTable[]>([])

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
			setTabelas(company.tabelas)
			
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

	function handleTableChange(e: ChangeEvent<HTMLInputElement>, index: number)
	{
		let tables = [...tabelas]

		const name = e.target.value
		tables[index].nome = name
		setTabelas(tables)
	}

	function handleAddTable()
	{
		setTabelas([...tabelas, {nome: ''}])
	}

	function handleRemoveTable(index: number)
	{
		let tables = [...tabelas]
		tables.splice(index, 1)
		setTabelas(tables)
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
		data.append('tabelas', JSON.stringify(tabelas))

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
			{/* imagem */}
			<div className='field' >
				<label htmlFor='imageFile'>Imagem</label>
				<Dropzone
					name='imageFile'
					id='imageFile'
					onFileUploaded={setImagem}
					shownFileUrl={company && company.imagem}
				/>
			</div>
			{/* razao_social */}
			<div className='field' >
				<label htmlFor='razao_social'>Razão social</label>
				<input
					type='text'
					name='razao_social'
					id='razao_social'
					value={razaoSocial}
					onChange={handleInputChange}
				/>
			</div>
			{/* nome_fantasia */}
			<div className='field' >
				<label htmlFor='nome_fantasia'>Nome fantasia</label>
				<input
					type='text'
					name='nome_fantasia'
					id='nome_fantasia'
					value={nomeFantasia}
					onChange={handleInputChange}
				/>
			</div>
			{/* cnpj */}
			<div className='field' >
				<label htmlFor='cnpj'>CNPJ</label>
				<input
					type='text'
					name='cnpj'
					id='cnpj'
					value={shownCnpj}
					onChange={handleInputChange}
					maxLength={18}
				/>
			</div>
			{/* telefones */}
			<div className='field' >
				<label htmlFor='telefone'>Telefones</label>
				<ul>
					{shownNumbers.map((number, index) => (
						<li key={index} className='phone'>
							<input
								type='text'
								name='telefone'
								id='telefone'
								value={number}
								onChange={(e) => handleNumberChange(e, index)}
							/>
							<button type='button' onClick={() => handleRemoveNumber(index)}>-</button>
						</li>
					))}
					<button type='button' onClick={handleAddNumber}>+</button>
				</ul>
			</div>
			{/* email */}
			<div className='field' >
				<label htmlFor='email'>E-mail</label>
				<input
					type='email'
					name='email'
					id='email'
					value={email}
					onChange={handleInputChange}
				/>
			</div>
			{/* comissao */}
			<div className='field' >
				<label htmlFor='comissao_porcentagem'>Comissão - Porcentagem</label>
				<input
					type='number'
					name='comissao_porcentagem'
					id='comissao_porcentagem'
					value={comissao.porcentagem}
					onChange={(e) => handleComissaoChange(e)}
				/>
				<label htmlFor='comissao_obs'>Comissão - Observações</label>
				<ul>
					{comissao.obs.map((obs, index) => (
						<li key={index} className='obs'>
							<input
								type='text'
								name='comissao_obs'
								id='comissao_obs'
								value={obs}
								onChange={(e) => handleComissaoChange(e, index)}
							/>
							<button type='button' onClick={() => handleRemoveComissaoObs(index)} >-</button>
						</li>
					))}
					<button type='button' onClick={handleAddComissaoObs}>+</button>
				</ul>
			</div>
			{/* descricao_curta */}
			<div className='field' >
				<label htmlFor='descricao_curta'>Descrição curta</label>
				<input
					type='text'
					name='descricao_curta'
					id='descricao_curta'
					value={descricaoCurta}
					onChange={handleInputChange}
				/>
			</div>
			{/* descricao */}
			<div className='field textareaField' >
				<label htmlFor='descricao'>Descrição</label>
				<textarea
					name='descricao'
					id='descricao'
					cols={30}
					rows={10}
					value={descricao}
					onChange={handleTextareaChange}
				/>
			</div>
			{/* site */}
			<div className='field' >
				<label htmlFor='site'>Site</label>
				<input
					type='link'
					name='site'
					id='site'
					value={site}
					onChange={handleInputChange}
				/>
			</div>
			{/* tabela */}
			<div className='field' >
				<label htmlFor='tabela'>Tabelas</label>
				<ul>
					{tabelas.map((tabela, index) => (
						<li key={index} className='table'>
							<input
								type='text'
								name='tabela'
								id='tabela'
								value={tabela.nome}
								onChange={(e) => handleTableChange(e, index)}
							/>
							<button type='button' onClick={() => handleRemoveTable(index)}>-</button>
						</li>
					))}
					<button type='button' onClick={handleAddTable}>+</button>
				</ul>
			</div>
			
			<div className='buttons'>
				<button type='button' onClick={Router.back} className='cancel' >Cancelar</button>
				<button type='submit' className='submit' >Confirmar</button>
			</div>
		</Container>
	)
}

export default CompanyForm