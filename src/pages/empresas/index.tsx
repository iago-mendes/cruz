import Head from 'next/head'
import {FiEdit3} from 'react-icons/fi'
import {BiBuildings, BiPlus, BiSearch} from 'react-icons/bi'
import Router from 'next/router'

import api from '../../services/api'
import {useSession} from 'next-auth/client'
import Loading from '../../components/Loading'
import {GetStaticProps } from 'next'

interface User
{
	id: string
	role: string
}

interface CompaniesProps
{
	companies: Array<
	{
		id: string
		imagem: string
		nome_fantasia: string
		descricao_curta: string
	}>
}

const Companies: React.FC<CompaniesProps> = ({companies}) =>
{
	const [session, loading] = useSession()

	if (loading) return <Loading />

	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser

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
          {
            user.role === 'admin' ?
            <button>
              <BiPlus size={30} />
              <span>Adicionar</span>
            </button>
            : <div/>
          }
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
              <h1 onClick={() => Router.push(`/empresas/${company.id}`)}>
                {company.nome_fantasia}
              </h1>
              <h2>{company.descricao_curta}</h2>
            </div>
            {
              user.role === 'admin' ?
              <button title="Editar" onClick={() => Router.push(`/empresas/${company.id}/editar`)}>
                <FiEdit3 size={25} />
              </button>
              : <div />
            }
          </div>
        ))}
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ctx =>
{
	let companies = []
	await api.get('companies')
		.then(res => companies = res.data)
		.catch(err => console.error(err.message))

	return {
		props: {companies},
		revalidate: 1
	}
}

export default Companies