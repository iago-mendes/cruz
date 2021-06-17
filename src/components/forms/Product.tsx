import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'

import Container from '../../styles/components/forms/global'
import api from '../../services/api'
import {CompanyTable as Table} from '../../models/company'
import Product, {ProductTable} from '../../models/product'
import Dropzone from '../Dropzone'
import successAlert from '../../utils/alerts/success'
import NumberInput from '../NumberInput'
import FormButtons from '../FormButtons'
import { catchError } from '../../utils/catchError'
import { handleObjectId } from '../../utils/handleObjectId'
import warningAlert from '../../utils/alerts/warning'

interface ProductFormProps
{
	method: string
	companyId: string
	
	nome: string
	setNome: (name: string) => void
	
	id?: string
	product?: Product
}

const ProductForm: React.FC<ProductFormProps> = ({method, companyId, nome, setNome, id, product}) =>
{
	const {back} = useRouter()
    
	const [imagem, setImagem] = useState<File>()
	const [codigo, setCodigo] = useState('')
	const [unidade, setUnidade] = useState('')
	const [peso, setPeso] = useState(0)
	const [volume, setVolume] = useState(0)
	const [ipi, setIpi] = useState(0)
	const [st, setSt] = useState(0)
	const [comissao, setComissao] = useState(0)
	const [tabelas, setTabelas] = useState<ProductTable[]>([])

	const [companyTables, setCompanyTables] = useState<Table[]>([])

	useEffect(() =>
	{
		api.get(`companies/${companyId}/raw`).then(({data}:{data: {tabelas: Table[]}}) =>
		{
			setCompanyTables(data.tabelas)
		})
	}, [])

	useEffect(() =>
	{
		if (product)
		{
			if (product.nome)
				setNome(product.nome)
			if (product.codigo)
				setCodigo(product.codigo)
			if (product.unidade)
				setUnidade(product.unidade)
			if (product.peso)
				setPeso(product.peso)
			if (product.volume)
				setVolume(product.volume)
			if (product.ipi)
				setIpi(product.ipi)
			if (product.st)
				setSt(product.st)
			if (product.comissao)
				setComissao(product.comissao)
		}
	}, [product])

	useEffect(() =>
	{
		if (companyTables.length > 0)
		{
			if (product && product.tabelas)
			{
				if (product.tabelas.length === companyTables.length)
					setTabelas(product.tabelas)
				else
				{
					const tmpTables: ProductTable[] = companyTables.map(companyTable =>
					{
						const productTable = product.tabelas.find(({id}) => id === companyTable._id)

						if (productTable)
							return productTable
						else
							return {id: companyTable._id, preco: 0}
					})

					setTabelas(tmpTables)
				}
			}
			else
			{
				const tmpTables: ProductTable[] = companyTables.map(companyTable => (
					{
						id: companyTable._id,
						preco: 0
					}))

				setTabelas(tmpTables)
			}
		}
	}, [product, companyTables])

	function handleTablePriceChange(price: number, index: number)
	{
		let tmpTables = [...tabelas]
		tmpTables[index].preco = price
		setTabelas(tmpTables)
	}

	function validateFields()
	{
		if (nome === '')
			return {areFieldsValid: false, warning: 'Você precisa informar o nome.'}
		
		if (codigo === '')
			return {areFieldsValid: false, warning: 'Você precisa informar o código.'}
		
		if (unidade === '')
			return {areFieldsValid: false, warning: 'Você precisa informar a unidade.'}
		
		return {areFieldsValid: true, warning: ''}
	}

	function handleSubmit()
	{
		const {areFieldsValid, warning} = validateFields()
		if(!areFieldsValid)
			return warningAlert('Dados inválidos!', warning)

		const data = new FormData()

		data.append('_id', handleObjectId())
		if (imagem)
			data.append('imagem', imagem)
		data.append('nome', nome)
		data.append('codigo', String(codigo))
		data.append('unidade', unidade)
		data.append('ipi', String(ipi))
		data.append('st', String(st))
		data.append('comissao', String(comissao))
		data.append('tabelas', JSON.stringify(tabelas))

		if (method === 'post')
		{
			api.post(`companies/${companyId}/products`, data)
				.then(() =>
				{
					successAlert('Produto criado com sucesso!')
					back()
				})
				.catch(catchError)
		}
		else if (method === 'put')
		{
			api.put(`companies/${companyId}/products/${id}`, data)
				.then(() =>
				{
					successAlert('Produto atualizado com sucesso!')
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
					shownFileUrl={product && product.imagem}
				/>
			</div>
			{/* nome */}
			<div className='required field'>
				<label htmlFor='nome'>Nome</label>
				<input
					type='text'
					name='nome'
					id='nome'
					value={nome}
					onChange={e => setNome(e.target.value)}
				/>
			</div>
			{/* codigo */}
			<div className='required field'>
				<label htmlFor='codigo'>Código</label>
				<input
					type='number'
					name='codigo'
					id='codigo'
					value={codigo}
					onChange={e => setCodigo(e.target.value)}
				/>
			</div>
			{/* unidade */}
			<div className='required field'>
				<label htmlFor='unidade'>Unidade</label>
				<input
					type='text'
					name='unidade'
					id='unidade'
					value={unidade}
					onChange={e => setUnidade(e.target.value)}
				/>
			</div>
			{/* peso */}
			<div className='field'>
				<label htmlFor='peso'>Peso (kg)</label>
				<NumberInput
					value={peso}
					setValue={setPeso}
					name='peso'
				/>
			</div>
			{/* volume */}
			<div className='field'>
				<label htmlFor='volume'>Volume (m³)</label>
				<NumberInput
					value={volume}
					setValue={setVolume}
					name='volume'
				/>
			</div>
			{/* ipi */}
			<div className='required field'>
				<label htmlFor='ipi'>Ipi (%)</label>
				<NumberInput
					name='ipi'
					value={ipi}
					setValue={setIpi}
				/>
			</div>
			{/* st */}
			<div className='required field'>
				<label htmlFor='st'>St (%)</label>
				<NumberInput
					value={st}
					setValue={setSt}
					name='st'
				/>
			</div>
			{/* comissao */}
			<div className='field'>
				<label htmlFor='comissao'>Comissão (%)</label>
				<NumberInput
					name='comissao'
					value={comissao}
					setValue={setComissao}
				/>
			</div>
			{/* tabelas */}
			<div className='required field'>
				<label htmlFor='tabela'>Tabelas</label>
				<ul>
					{tabelas.map(({id, preco}, index) =>
					{
						const table = companyTables.find(({_id}) => String(_id) == String(id))
						const name = table ? table.nome : 'Sem Nome'

						return (
							<li key={index}>
								<span className='label' >Tabela {name}: R$</span>
								<NumberInput
									value={preco}
									setValue={n => handleTablePriceChange(n, index)}
									name='tabela'
								/>
							</li>
						)
					})}
				</ul>
			</div>
			
			<FormButtons
				handleCancel={back}
				handleSubmit={handleSubmit}
			/>
		</Container>
	)
}

export default ProductForm