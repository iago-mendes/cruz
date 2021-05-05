import Link from 'next/link'
import {useRouter} from 'next/router'
import {BiBuildings, BiLineChart, BiSpreadsheet, BiUserCircle} from 'react-icons/bi'
import {FiUsers, FiLogOut} from 'react-icons/fi'
import {FaStore} from 'react-icons/fa'
import {signOut} from 'next-auth/client'

import Logo from '../assets/logo.svg'
import Container from '../styles/components/Menu'

const Menu: React.FC = () =>
{
	const {pathname} = useRouter()

	if (pathname === '/login')
		return null

	function checkRoute(routes: string[])
	{
		const current = pathname.split('/')
		if (routes.includes(`/${current[1]}`))
			return "#CC9749"
		else
			return "#E2DADB"
	}

	return (
		<Container>
			<header>
				<img src={Logo} alt="Cruz Representações" />
			</header>

			<main>
				<ul>
					<Link href='/' >
						<a>
							<BiSpreadsheet size={25} color={checkRoute(['/', '/pedidos'])}/>
							<span>Pedidos</span>
						</a>
					</Link>
					<Link href='/clientes' >
						<a>
							<FaStore size={25} color={checkRoute(['/clientes'])}/>
							<span>Clientes</span>
						</a>
					</Link>
					<Link href='/empresas' >
						<a>
							<BiBuildings size={25} color={checkRoute(['/empresas'])}/>
							<span>Empresas</span>
						</a>
					</Link>
					<Link href='/vendedores' >
						<a>
							<FiUsers size={25} color={checkRoute(['/vendedores'])}/>
							<span>Vendedores</span>
						</a>
					</Link>
					<Link href='/indicadores' >
						<a>
							<BiLineChart size={25} color={checkRoute(['/indicadores'])}/>
							<span>Indicadores</span>
						</a>
					</Link>
				</ul>
			</main>

			<footer>
				<ul>
					<Link href='/usuario' >
						<a>
							<BiUserCircle size={25} color={checkRoute(['/usuario'])}/>
							<span>Usuário</span>
						</a>
					</Link>
					<a onClick={() => signOut({callbackUrl: '/login'})}>
						<FiLogOut size={25} color="#E2DADB"/>
						<span>Sair</span>
					</a>
				</ul>
			</footer>
		</Container>
	)
}

export default Menu