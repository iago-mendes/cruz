import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import Head from 'next/head'
import {useSession} from 'next-auth/client'

import Container from '../../../../styles/pages/empresas/[company]/[line]/editar'
import api from '../../../../services/api'
import Header from '../../../../components/Header'
import LineForm, {Line} from '../../../../components/forms/Line'
import Loading from '../../../../components/Loading'
import User from '../../../../utils/userType'
import NotAllowed from '../../../../components/NotAllowed'

const EditLine: React.FC = () =>
{
	const Router = useRouter()
	const [session, loading] = useSession()
	
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
	
	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser

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