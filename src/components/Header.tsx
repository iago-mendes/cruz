import {useRouter} from 'next/router'
import {BiBuildings, BiSearch, BiLineChart, BiSpreadsheet} from 'react-icons/bi'
import {FiUsers} from 'react-icons/fi'
import {FaStore} from 'react-icons/fa'
import {useEffect, useState} from 'react'

import Container from '../styles/components/Header'

interface HeaderProps
{
	display: string

	showSearch?: boolean
	search?: string
	setSearch?: Function
}

const Header: React.FC<HeaderProps> = ({display, showSearch = false, search = '', setSearch}) =>
{
	const Router = useRouter()
	const [page, setPage] = useState('')

	useEffect(() =>
	{
		const tmp = Router.pathname.split('/')[1]
		setPage(tmp)
	}, [Router.pathname])

	function getIcon()
	{
		if (page === '') //pedidos
			return <BiSpreadsheet size={30} />
		if (page === 'clientes')
			return <FaStore size={30} />
		if (page === 'empresas')
			return <BiBuildings size={30} />
		if (page === 'vendedores')
			return <FiUsers size={30} />
		if (page === 'indicadores')
			return <BiLineChart size={30} />
	}

  return (
		<Container>
			<div className='display'>
				{getIcon()}
				<h1>{display}</h1>
			</div>
			{showSearch && (
				<div className='inputField'>
					<BiSearch size={25} />
					<input
						type='text'
						name='search'
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
				</div>
			)}
		</Container>
  )
}

export default Header