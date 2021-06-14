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

	const [tableNames, setTableNames] = useState<Table[]>([])

	useEffect(() =>
	{
		api.get(`companies/${companyId}/raw`).then(({data}:{data: {tabelas: Table[]}}) =>
		{
			setTableNames(data.tabelas)
		})
	}, [])

	useEffect(() =>
	{
		if (product)
		{
			setNome(product.nome)
			setCodigo(product.codigo)
			setUnidade(product.unidade)
			setPeso(product.peso)
			setVolume(product.volume)
			setIpi(product.ipi)
			setSt(product.st)
			setComissao(product.comissao)
			setTabelas(product.tabelas)
		}
	}, [product])

	function handleTablePriceChange(price: number, index: number)
	{
		let tmpTables = [...tabelas]
		tmpTables[index].preco = price
		setTabelas(tmpTables)
	}

	function handleSubmit()
	{
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
			{/* codigo */}
			<div className='field'>
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
			<div className='field'>
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
			<div className='field'>
				<label htmlFor='ipi'>Ipi</label>
				<input
					type='number'
					name='ipi'
					id='ipi'
					value={ipi}
					onChange={e => setIpi(Number(e.target.value))}
				/>
			</div>
			{/* st */}
			<div className='field'>
				<label htmlFor='st'>St</label>
				<input
					type='number'
					name='st'
					id='st'
					value={st}
					onChange={e => setSt(Number(e.target.value))}
				/>
			</div>
			{/* comissao */}
			<div className='field'>
				<label htmlFor='comissao'>Comissão</label>
				<input
					type='number'
					name='comissao'
					id='comissao'
					value={comissao}
					onChange={e => setComissao(Number(e.target.value))}
				/>
			</div>
			{/* tabelas */}
			<div className='field'>
				<label htmlFor='tabela'>Tabelas</label>
				<ul>
					{tabelas.map(({id, preco}, index) =>
					{
						const table = tableNames.find(({_id}) => String(_id) == String(id))
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