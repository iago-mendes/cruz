import Head from 'next/head'
import { useEffect, useState } from 'react'
import {FiEdit3} from 'react-icons/fi'
import {BiBuildings, BiPlus, BiSearch} from 'react-icons/bi'

import api from '../../services/api'

interface Company
{
  id: string
  imagem: string
  nome_fantasia: string
  descricao_curta: string
}

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([])

  useEffect(() =>
  {
    api.get('companies').then(res => setCompanies(res.data))
  }, [])

  return (
    <div id="companies" className="container">
      <Head>
        <title>Empresas | Cruz Representações</title>
      </Head>
      <header>
        <div className="group">
          <BiBuildings size={30} />
          <h1>Empresas</h1>
        </div>
        <div className="group">
          <button>
            <BiPlus size={30} />
            <span>Adicionar</span>
          </button>
          <div className="inputField">
            <BiSearch size={25} color='rgb(138, 138, 138)' />
            <input type="text" name="search"/>
          </div>
        </div>
      </header>
      <main>
        {companies.map(company => (
          <div key={company.id} className="company">
            <img src={company.imagem} alt={company.nome_fantasia}/>
            <div className="companyText">
              <h1>{company.nome_fantasia}</h1>
              <h2>{company.descricao_curta}</h2>
            </div>
            <button title="Editar"><FiEdit3 size={25} /></button>
          </div>
        ))}
      </main>
    </div>
  )
}

export async function getStaticProps(ctx)
{
  return {
    props: {role: 'seller'}
  }
}