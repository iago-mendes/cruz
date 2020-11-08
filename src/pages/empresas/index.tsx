import {getCookies} from 'cookies-next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import {FiEdit3} from 'react-icons/fi'

import api from '../../services/api'
import styles from '../../styles/pages/empresas/index.module.css'

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
    <div className="container">
      <Head>
        <title>Empresas | Cruz Representações</title>
      </Head>
      <main className={styles.companies}>
        {companies.map(company => (
          <div key={company.id} className={styles.company}>
            <img src={company.imagem} alt={company.nome_fantasia}/>
            <div className={styles.companyText}>
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