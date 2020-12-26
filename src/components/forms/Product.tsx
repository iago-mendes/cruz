import {useRouter} from 'next/router'
import {ChangeEvent, FormEvent, useEffect, useState} from 'react'

import Container from '../../styles/components/forms/Product'
import api from '../../services/api'
import {Table} from './Company'

interface ProductTable
{
	id: string
	preco: number
}

export interface Product
{
	_id: string
	imagem: string
	nome: string
	codigo: number
	unidade: string
	ipi: number
	st: number
	comissao: number
	tabelas: ProductTable[]
}

interface ProductFormProps
{
	method: string
	companyId: string
	lineId: string
	
	nome: string
	setNome: Function
	
	id?: string
	product?: Product
}

const ProductForm: React.FC<ProductFormProps> = ({method, companyId, lineId, nome, setNome, id, product}) =>
{
	const Router = useRouter()
    
	const [imagem, setImagem] = useState<File>()
	const [codigo, setCodigo] = useState(0)
	const [unidade, setUnidade] = useState('')
	const [ipi, setIpi] = useState(0)
	const [st, setSt] = useState(0)
	const [comissao, setComissao] = useState(0)
	const [tabelas, setTabelas] = useState<ProductTable[]>([])

	const [tableNames, setTableNames] = useState<Table[]>([])

	useEffect(() =>
	{
		api.get(`companies-all/${companyId}`).then(({data}:{data: {tabelas: Table[]}}) =>
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
			setIpi(product.ipi)
			setSt(product.st)
			setComissao(product.comissao)
			setTabelas(product.tabelas)
		}
	}, [product])

	function handleTablePriceChange(e: ChangeEvent<HTMLInputElement>, index: number)
	{
		let tmp = [...tabelas]
		tmp[index].preco = Number(e.target.value)
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
			await api.post(`companies/${companyId}/lines/${lineId}/products`, data)
			.then(() =>
			{
				alert('Produto criado com sucesso!')
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
			await api.put(`companies/${companyId}/lines/${lineId}/products/${id}`, data)
			.then(() =>
			{
				alert('Produto atualizado com sucesso!')
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
				<input type="file" name="imagem" id="imagem" onChange={e => setImagem(e.target.files[0])}/>
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
				<label htmlFor="codigo">Código</label>
				<input
					type="number"
					name="codigo"
					id="codigo"
					value={codigo}
					onChange={e => setCodigo(Number(e.target.value))}
				/>
			</div>
			<div>
				<label htmlFor="unidade">Unidade</label>
				<input
					type="text"
					name="unidade"
					id="unidade"
					value={unidade}
					onChange={e => setUnidade(e.target.value)}
				/>
			</div>
			<div>
				<label htmlFor="ipi">Ipi</label>
				<input
					type="number"
					name="ipi"
					id="ipi"
					value={ipi}
					onChange={e => setIpi(Number(e.target.value))}
				/>
			</div>
			<div>
				<label htmlFor="st">St</label>
				<input
					type="number"
					name="st"
					id="st"
					value={st}
					onChange={e => setSt(Number(e.target.value))}
				/>
			</div>
			<div>
				<label htmlFor="comissao">Comissão</label>
				<input
					type="number"
					name="comissao"
					id="comissao"
					value={comissao}
					onChange={e => setComissao(Number(e.target.value))}
				/>
			</div>
			<div>
				<label htmlFor="tabela">Tabelas</label>
				<ul>
					{tableNames.map(({nome}, index) => (
						<li key={index}>
							<span>Tabela {nome}: R$</span>
							<input
								type="number"
								name="tabela"
								id="tabela"
								value={tabelas[index] ? tabelas[index].preco : 0}
								onChange={(e) => handleTablePriceChange(e, index)}
							/>
						</li>
					))}
				</ul>
			</div>
			<div className="buttons">
				<button type="button" onClick={Router.back}>Cancelar</button>
				<button type="submit">Confirmar</button>
			</div>
		</Container>
	)
}

export default ProductForm