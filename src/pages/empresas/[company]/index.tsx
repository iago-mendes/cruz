import Router from 'next/router'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import {FiEdit3} from 'react-icons/fi'
import {BiBuildings, BiSearch} from 'react-icons/bi'

import api from '../../../services/api'
import User from '../../../utils/userContext'

interface Line
{
    id: string
    nome: string
    imagem: string
}

export default function Lines()
{
    const user = useContext(User)

    const {company} = Router.query
    if (!company) return <h1>Carregando...</h1>

    const [lines, setLines] = useState<Line[]>([])
    const [companyName, setCompanyName] = useState('')

    useEffect(() =>
    {
        console.log('[company]', company)
        api.get(`companies/${company}/products`).then(res => setLines(res.data))
        api.get(`companies/${company}`).then(res => setCompanyName(res.data.nome_fantasia))
    }, [])

    return (
        <div className="container" id="company">
            <Head>
                <title>{companyName} | Cruz Representações</title>
            </Head>
            <header>
                <div className="group">
                    <BiBuildings size={30} />
                    <h1>{companyName} {'>'} Linhas</h1>
                </div>
                <div className="group">
                    <div />
                    <div className="inputField">
                        <BiSearch size={25} color='rgb(138, 138, 138)' />
                        <input type="text" name="search"/>
                    </div>
                </div>
            </header>
            <main>
                {lines && lines.map(line => (
                    <div key={line.id} className="line">
                        <img src={line.imagem} alt={line.nome} />
                        <h1>{line.nome}</h1>
                        {
                            user.role === 'admin' ?
                            <button title="Editar"><FiEdit3 size={15} /></button>
                            : <div />
                        }
                    </div>
                ))}
            </main>
        </div>
    )
}