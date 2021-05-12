import Link from 'next/link'
import {useRouter} from 'next/router'
import {BiBuildings, BiLineChart, BiSpreadsheet, BiUserCircle} from 'react-icons/bi'
import {FiUsers, FiLogOut, FiMenu, FiX} from 'react-icons/fi'
import {FaStore} from 'react-icons/fa'
import {useEffect, useState} from 'react'

import Logo from '../assets/logo.svg'
import {Sidebar, MobileMenu, BurgerMenu, OptionsList} from '../styles/components/Menu'
import useDimensions from '../hooks/useDimensions'
import useClickOutside from '../hooks/useClickOutside'
import useAuth from '../hooks/useAuth'

const Menu: React.FC = () =>
{
	const {pathname} = useRouter()
	const {inDesktop} = useDimensions()
	
	const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false)
	const burguerMenuRef = useClickOutside(() => setIsBurgerMenuOpen(false))

	useEffect(() =>
	{
		setIsBurgerMenuOpen(false)
	}, [pathname])

	if (pathname === '/login')
		return null

	if (inDesktop)
		return (
			<Sidebar>
				<header>
					<img src={Logo} alt='Cruz Representações' />
				</header>

				<MainOptions />

				<FooterOptions />
			</Sidebar>
		)
	
	return (
		<MobileMenu>
			<button
				className='controller'
				onClick={() => setIsBurgerMenuOpen(true)}
			>
				<FiMenu />
			</button>

			<img src={Logo} alt='Cruz Representações' />

			<BurgerMenu
				isOpen={isBurgerMenuOpen}
				ref={burguerMenuRef}
			>
				<button
					className='controller'
					onClick={() => setIsBurgerMenuOpen(false)}
				>
					<FiX />
				</button>

				<MainOptions />

				<FooterOptions />
			</BurgerMenu>
		</MobileMenu>
	)
}

function checkRoute(routes: string[])
{
	const {pathname} = useRouter()

	const current = pathname.split('/')
	if (routes.includes(`/${current[1]}`))
		return '#CC9749'
	else
		return '#E2DADB'
}

const MainOptions: React.FC = () => (
	<main>
		<OptionsList>
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
		</OptionsList>
	</main>
)

const FooterOptions: React.FC = () =>
{
	const {logOut} = useAuth()

	return (
		<footer>
			<OptionsList>
				<Link href='/usuario' >
					<a>
						<BiUserCircle size={25} color={checkRoute(['/usuario'])}/>
						<span>Usuário</span>
					</a>
				</Link>
				<a onClick={logOut} >
					<FiLogOut size={25} color='#E2DADB'/>
					<span>Sair</span>
				</a>
			</OptionsList>
		</footer>
	)
}

export default Menu