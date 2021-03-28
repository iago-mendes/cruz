import {useRouter} from 'next/router'
import React, {FormEvent, useEffect, useState} from 'react'

import Container from '../../styles/components/forms/global'
import api from '../../services/api'
import {CompanyTable as Table} from '../../models/company'
import Product, {ProductTable} from '../../models/product'
import Dropzone from '../Dropzone'
import successAlert from '../../utils/alerts/success'
import errorAlert from '../../utils/alerts/error'

interface ProductFormProps
{
	method: string
	companyId: string
	
	nome: string
	setNome: Function
	
	id?: string
	product?: Product
}

const ProductForm: React.FC<ProductFormProps> = ({method, companyId, nome, setNome, id, product}) =>
{
	const Router = useRouter()
    
	const [imagem, setImagem] = useState<File>()
	const [codigo, setCodigo] = useState(0)
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

			const tmpTables = data.tabelas.map(table => ({id: table._id, preco: 0}))
			setTabelas(tmpTables)
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

	function handleTablePriceChange(price: string | undefined, index: number)
	{
		let tmp = [...tabelas]
		if (price)
			tmp[index].preco = Number(price)
		setTabelas(tmp)
	}

	async function handleSubmit(e: FormEvent)
	{
		e.preventDefault()

		const data = new FormData()

		if (imagem) data.append('imagem', imagem)
		data.append('nome', nome)
		data.append('codigo', String(codigo))
		data.append('unidade', unidade)
		data.append('ipi', String(ipi))
		data.append('st', String(st))
		data.append('comissao', String(comissao))
		data.append('tabelas', JSON.stringify(tabelas))

		if (method === 'post')
		{
			await api.post(`companies/${companyId}/products`, data)
			.then(() =>
			{
				successAlert('Produto criado com sucesso!')
				Router.back()
			})
			.catch(err =>
			{
				console.error(err)
				errorAlert('Algo errado aconteceu!')
			})
		}
		else if (method === 'put')
		{
			await api.put(`companies/${companyId}/products/${id}`, data)
			.then(() =>
			{
				successAlert('Produto atualizado com sucesso!')
				Router.back()
			})
			.catch(err =>
			{
				console.error(err)
				errorAlert('Algo errado aconteceu!')
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
					onChange={e => setCodigo(Number(e.target.value))}
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
				<input
					type='number'
					name='peso'
					id='peso'
					value={peso !== 0 ? peso : undefined}
					onChange={e => setPeso(Number(e.target.value))}
				/>
			</div>
			{/* volume */}
			<div className='field'>
				<label htmlFor='volume'>Volume (m³)</label>
				<input
					type='number'
					name='volume'
					id='volume'
					value={volume !== 0 ? volume : undefined}
					onChange={e => setVolume(Number(e.target.value))}
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
					{tableNames.map(({nome}, index) => (
						<li key={index}>
							<span>Tabela {nome}: R$</span>
							<input
								type='number'
								name='tabela'
								id='tabela'
								value={tabelas[index] ? tabelas[index].preco : 0}
								onChange={e => handleTablePriceChange(e.target.value, index)}
							/>
						</li>
					))}
				</ul>
			</div>
			
			<div className='buttons'>
				<button type='button' onClick={Router.back} className='cancel' >
					Cancelar
				</button>
				<button type='submit' className='submit' >
					Confirmar
				</button>
			</div>
		</Container>
	)
}

export default ProductForm