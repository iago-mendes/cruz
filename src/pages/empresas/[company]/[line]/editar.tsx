import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import Head from 'next/head'

import Container from '../../../../styles/pages/empresas/[company]/[line]/editar'
import api from '../../../../services/api'
import Header from '../../../../components/Header'
import LineForm, {Line} from '../../../../components/forms/Line'
import Loading from '../../../../components/Loading'
import NotAllowed from '../../../../components/NotAllowed'
import useUser from '../../../../hooks/useUser'

const EditLine: React.FC = () =>
{
	const Router = useRouter()
	const {user, loading} = useUser()
	
	const {company: companyId, line: id} = Router.query

	const [nome, setNome] = useState('')
	const [line, setLine] = useState<Line>(
	{
		id: '',
		nome: ''
	})

	useEffect(() =>
	{
		api.get(`companies/${companyId}/lines`).then(({data}:{data: Line[]}) =>
		{
			data.map(line =>
			{
				if (line.id == id)
					setLine({id: id as string, nome: line.nome})
			})
		})
	}, [companyId, id])

	if (!companyId || loading)
		return <Loading />
	if (user.role !== 'admin')
		return <NotAllowed />

	return (
		<Container className="container">
			<Head>
					<title>{nome} | Cruz Representações</title>
			</Head>

			<Header display={nome} />

			<div className="center">
				<LineForm
					method='put'
					company={companyId as string}
					nome={nome}
					setNome={setNome}
					id={id as string}
					line={line}
				/>
			</div>
		</Container>
	)
}

export default EditLine