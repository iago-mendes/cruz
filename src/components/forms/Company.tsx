import {useRouter} from 'next/router'
import {ChangeEvent, useEffect, useState} from 'react'
import {FiMinus, FiPlus} from 'react-icons/fi'

import Container from '../../styles/components/forms/global'
import api from '../../services/api'
import Company, {CompanyCondition, CompanyTable} from '../../models/company'
import Dropzone from '../Dropzone'
import successAlert from '../../utils/alerts/success'
import FormButtons from '../FormButtons'
import NumberInput from '../NumberInput'
import { catchError } from '../../utils/catchError'
import { handleObjectId } from '../../utils/handleObjectId'
import warningAlert from '../../utils/alerts/warning'

interface CompanyFormProps
{
	method: string
	
	nomeFantasia: string
	setNomeFantasia: (p: string) => void
	
	id?: string
	company?: Company
}

const CompanyForm: React.FC<CompanyFormProps> = ({method, nomeFantasia, setNomeFantasia, id, company}) =>
{
	const {back} = useRouter()
    
	const [imagem, setImagem] = useState<File>()
	const [razaoSocial, setRazaoSocial] = useState('')
	const [cnpj, setCnpj] = useState('')
	const [telefones, setTelefones] = useState([])
	const [email, setEmail] = useState('')
	const [comissao, setComissao] = useState({porcentagem: 0, obs: []})
	const [descricaoCurta, setDescricaoCurta] = useState('')
	const [descricao, setDescricao] = useState('')
	const [site, setSite] = useState('')
	const [tabelas, setTabelas] = useState<CompanyTable[]>([])
	const [condicoes, setCondicoes] = useState<CompanyCondition[]>([])

	useEffect(() =>
	{
		if (company)
		{
			if (company.razao_social)
				setRazaoSocial(company.razao_social)
			if (company.nome_fantasia)
				setNomeFantasia(company.nome_fantasia)
			if (company.cnpj)
				setCnpj(company.cnpj)
			if (company.telefones)
				setTelefones(company.telefones)
			if (company.email)
				setEmail(company.email)
			if (company.comissao)
				setComissao(company.comissao)
			if (company.descricao_curta)
				setDescricaoCurta(company.descricao_curta)
			if (company.descricao)
				setDescricao(company.descricao)
			if (company.site)
				setSite(company.site)
			if (company.tabelas)
				setTabelas(company.tabelas)
			if (company.condicoes)
				setCondicoes(company.condicoes)
		}
	}, [company])

	function handleInputChange(e: ChangeEvent<HTMLInputElement>)
	{
		if (e.target.name === 'imagem')
			setImagem(e.target.files[0])
		if (e.target.name === 'razao_social')
			setRazaoSocial(e.target.value)
		if (e.target.name === 'nome_fantasia')
			setNomeFantasia(e.target.value)
		if (e.target.name === 'cnpj')
			setCnpj(e.target.value)
		if (e.target.name === 'email')
			setEmail(e.target.value)
		if (e.target.name === 'descricao_curta')
			setDescricaoCurta(e.target.value)
		if (e.target.name === 'site')
			setSite(e.target.value)
	}

	function handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>)
	{
		if (e.target.name === 'descricao') setDescricao(e.target.value)
	}

	function handlePhoneChange(phone: string, index: number)
	{
		let tmpPhones = [...telefones]
		tmpPhones[index] = phone
		setTelefones(tmpPhones)
	}

	function handleComissaoChange(value: number | string, field: string, index = 0)
	{
		if (field === 'comissao_porcentagem')
		{
			const porcentagem = Number(value)
			setComissao({porcentagem, obs: [...comissao.obs]})
		}
		else if (field === 'comissao_obs')
		{
			let obs = [...comissao.obs]
			obs[index] = String(value)
			setComissao({porcentagem: comissao.porcentagem, obs})
		}
	}

	function handleAddPhone()
	{
		const tmpPhones = [...telefones, '']
		setTelefones(tmpPhones)
	}

	function handleRemovePhone(index: number)
	{
		let tmpPhones = [...telefones]
		tmpPhones.splice(index, 1)
		setTelefones(tmpPhones)
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

	function handleAddCondition()
	{
		setCondicoes([...condicoes, {nome: '', precoMin: 0}])
	}

	function handleRemoveCondition(index: number)
	{
		let tmpConditions = [...condicoes]
		tmpConditions.splice(index, 1)
		setCondicoes(tmpConditions)
	}

	function handleChangeCondition(value: string | number, index: number, field: string)
	{
		let tmpConditions = [...condicoes]

		switch (field)
		{
		case 'name':
			tmpConditions[index].nome = String(value)
			break
		case 'price':
			if (typeof value === 'number')
			{
				const tmpPrice = value
				tmpConditions[index].precoMin = tmpPrice
			}
			break
		default:
			break
		}

		setCondicoes(tmpConditions)
	}

	function validateFields()
	{
		if (razaoSocial === '')
			return {areFieldsValid: false, warning: 'Você precisa informar a razão social.'}
		
		if (nomeFantasia === '')
			return {areFieldsValid: false, warning: 'Você precisa informar o nome fantasia.'}
		
		if (cnpj === '')
			return {areFieldsValid: false, warning: 'Você precisa informar o CNPJ.'}
		
		if (comissao.porcentagem === 0)
			return {areFieldsValid: false, warning: 'Você precisa informar a porcentagem de comissão.'}
		
		if (tabelas.length === 0)
			return {areFieldsValid: false, warning: 'Você precisa informar pelo menos uma tabela.'}
		
		if (condicoes.length === 0)
			return {areFieldsValid: false, warning: 'Você precisa informar pelo menos uma condição de pagamento.'}
		
		return {areFieldsValid: true, warning: ''}
	}

	function handleSubmit()
	{
		const {areFieldsValid, warning} = validateFields()
		if(!areFieldsValid)
			return warningAlert('Dados inválidos!', warning)

		const data = new FormData()

		const tables = tabelas.map(table =>
		{
			const _id = handleObjectId()
			return {_id, ...table}
		})

		const conditions = condicoes.map(condition =>
		{
			const _id = handleObjectId()
			return {_id, ...condition}
		})

		data.append('_id', handleObjectId())
		if (imagem)
			data.append('imagem', imagem)
		data.append('razao_social', razaoSocial)
		data.append('nome_fantasia', nomeFantasia)
		data.append('cnpj', cnpj)
		data.append('telefones', JSON.stringify(telefones))
		data.append('email', email)
		data.append('comissao', JSON.stringify(comissao))
		data.append('descricao_curta', descricaoCurta)
		data.append('descricao', descricao)
		data.append('site', site)
		data.append('tabelas', JSON.stringify(tables))
		data.append('condicoes', JSON.stringify(conditions))

		if (method === 'post')
		{
			api.post('companies', data)
				.then(() =>
				{
					successAlert('Empresa criada com sucesso!')
					back()
				})
				.catch(catchError)
		}
		else if (method === 'put')
		{
			api.put(`companies/${id}`, data)
				.then(() =>
				{
					successAlert('Empresa atualizada com sucesso!')
					back()
				})
				.catch(catchError)
		}

		if (!navigator.onLine)
			back()
	}

	return (
		<Container onSubmit={e => e.preventDefault()} >
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
			<div className='required field' >
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
			<div className='required field' >
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
			<div className='required field' >
				<label htmlFor='cnpj'>CNPJ</label>
				<input
					type='text'
					name='cnpj'
					id='cnpj'
					value={cnpj}
					onChange={handleInputChange}
					maxLength={18}
				/>
			</div>
			{/* telefones */}
			<div className='field' >
				<label htmlFor='telefone'>Telefones</label>
				<ul>
					{telefones.map((phone, index) => (
						<li key={index} className='phone'>
							<input
								type='text'
								name='telefone'
								id='telefone'
								value={phone}
								onChange={e => handlePhoneChange(e.target.value, index)}
							/>
							<button type='button' onClick={() => handleRemovePhone(index)}>
								<FiMinus />
								<span>
									Remover telefone
								</span>
							</button>
						</li>
					))}
					<button type='button' onClick={handleAddPhone}>
						<FiPlus />
						<span>
							Adicionar telefone
						</span>
					</button>
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
			<div className='required field' >
				<label htmlFor='comissao_porcentagem'>Comissão - Porcentagem</label>
				<NumberInput
					value={comissao.porcentagem}
					setValue={n => handleComissaoChange(n, 'comissao_porcentagem')}

					name='comissao_porcentagem'
					placeholder='Porcentagem'
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
								onChange={e => handleComissaoChange(e.target.value, 'comissao_obs', index)}
							/>
							<button type='button' onClick={() => handleRemoveComissaoObs(index)} >
								<FiMinus />
								<span>
									Remover observação
								</span>
							</button>
						</li>
					))}
					<button type='button' onClick={handleAddComissaoObs}>
						<FiPlus />
						<span>
							Adicionar observação
						</span>
					</button>
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
			{/* tabelas */}
			<div className='required field' >
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
							<button type='button' onClick={() => handleRemoveTable(index)}>
								<FiMinus />
								<span>
									Remover tabela
								</span>
							</button>
						</li>
					))}
					<button type='button' onClick={handleAddTable}>
						<FiPlus />
						<span>
							Adicionar tabela
						</span>
					</button>
				</ul>
			</div>
			{/* condicoes */}
			<div className='long required field' >
				<label htmlFor='condicao'>Condições de pagamento</label>
				<ul>
					{condicoes.map((condicao, index) => (
						<li key={index} >
							<input
								type='text'
								name='condicao'
								id='condicao'
								value={condicao.nome}
								onChange={(e) => handleChangeCondition(e.target.value, index, 'name')}
								placeholder='Condição'
							/>
							<NumberInput
								value={condicao.precoMin}
								setValue={n => handleChangeCondition(n, index, 'price')}

								name='condicao'
								label='R$'
								placeholder='Preço'
							/>
							<button type='button' title='Remover' onClick={() => handleRemoveCondition(index)}>
								<FiMinus />
								<span>
									Remover condição
								</span>
							</button>
						</li>
					))}
					<button type='button' title='Adicionar' onClick={handleAddCondition}>
						<FiPlus />
						<span>
							Adicionar condição
						</span>
					</button>
				</ul>
			</div>
			
			<FormButtons
				handleCancel={back}
				handleSubmit={handleSubmit}
			/>
		</Container>
	)
}

export default CompanyForm