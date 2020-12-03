import {useRouter} from 'next/router'
import {FormEvent, useEffect, useState} from 'react'

import Container from '../../styles/components/forms/Line'
import api from '../../services/api'

export interface Line
{
	id: string
	imagem?: string
	nome: string
}

interface LineFormProps
{
	method: string
	company: string;
	
	nome: string
	setNome: Function
	
	id?: string
	line?: Line
}

const LineForm: React.FC<LineFormProps> = ({method, company, nome, setNome, id, line}) =>
{
	const Router = useRouter()

	const [imagem, setImagem] = useState<File>()

	useEffect(() =>
	{
		if (line)
		{
			setNome(line.nome)
		}
	}, [line])

	async function handleSubmit(e: FormEvent)
	{
		e.preventDefault()

		const data = new FormData()

		if (imagem) data.append('imagem', imagem)
		data.append('nome', nome)

		if (method === 'post')
		{
			await api.post(`companies/${company}/lines`, data)
			.then(() =>
			{
				alert('Linha criada com sucesso!')
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
			await api.put(`companies/${company}/lines/${id}`, data)
			.then(() =>
			{
				alert('Linha atualizada com sucesso!')
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
			<div className="buttons">
				<button type="button" onClick={Router.back}>Cancelar</button>
				<button type="submit">Confirmar</button>
			</div>
		</Container>
	)
}

export default LineForm