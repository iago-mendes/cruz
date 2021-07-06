import Link from 'next/link'
import {useRouter} from 'next/router'
import {
	BiBuildings,
	BiLineChart,
	BiSpreadsheet,
	BiUserCircle
} from 'react-icons/bi'
import {FiUsers, FiLogOut, FiMenu, FiX} from 'react-icons/fi'
import {FaStore, FaSync} from 'react-icons/fa'
import {RiWifiOffLine} from 'react-icons/ri'
import {useEffect, useState} from 'react'

import Logo from '../assets/images/logo.svg'
import {
	Sidebar,
	MobileMenu,
	BurgerMenu,
	OptionsList,
	OfflineIndicatorContainer,
	Option
} from '../styles/components/Menu'
import useDimensions from '../hooks/useDimensions'
import useClickOutside from '../hooks/useClickOutside'
import useAuth from '../hooks/useAuth'
import {sync} from '../services/offline/db/sync'

const Menu: React.FC = () => {
	const {pathname} = useRouter()
	const {inDesktop} = useDimensions()

	const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false)
	const burguerMenuRef = useClickOutside(() => setIsBurgerMenuOpen(false))

	useEffect(() => {
		setIsBurgerMenuOpen(false)
	}, [pathname])

	if (pathname === '/login') return null

	if (inDesktop)
		return (
			<Sidebar>
				<header>
					{navigator.onLine ? (
						<img src={Logo} alt="Cruz Representações" />
					) : (
						<OfflineIndicator />
					)}
				</header>

				<MainOptions />

				<FooterOptions />
			</Sidebar>
		)

	return (
		<MobileMenu>
			<button className="controller" onClick={() => setIsBurgerMenuOpen(true)}>
				<FiMenu />
			</button>

			{navigator.onLine ? (
				<img src={Logo} alt="Cruz Representações" />
			) : (
				<OfflineIndicator />
			)}

			<BurgerMenu isOpen={isBurgerMenuOpen} ref={burguerMenuRef}>
				<button
					className="controller"
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

function checkRoute(routes: string[]) {
	const {pathname} = useRouter()

	const current = pathname.split('/')
	if (routes.includes(`/${current[1]}`)) return true
	else return false
}

const MainOptions: React.FC = () => {
	const {user} = useAuth()

	return (
		<main>
			<OptionsList>
				<Link href="/">
					<Option active={checkRoute(['/', '/pedidos'])}>
						<BiSpreadsheet />
						<span>Pedidos</span>
					</Option>
				</Link>
				<Link href="/clientes">
					<Option active={checkRoute(['/clientes'])}>
						<FaStore />
						<span>Clientes</span>
					</Option>
				</Link>
				<Link href="/empresas">
					<Option active={checkRoute(['/empresas'])}>
						<BiBuildings />
						<span>Empresas</span>
					</Option>
				</Link>
				{user && user.role === 'admin' && (
					<>
						<Link href="/vendedores">
							<Option active={checkRoute(['/vendedores'])}>
								<FiUsers />
								<span>Vendedores</span>
							</Option>
						</Link>
						<Link href="/indicadores">
							<Option active={checkRoute(['/indicadores'])}>
								<BiLineChart />
								<span>Indicadores</span>
							</Option>
						</Link>
					</>
				)}
			</OptionsList>
		</main>
	)
}

const FooterOptions: React.FC = () => {
	const {logOut} = useAuth()

	return (
		<footer>
			<OptionsList>
				<Link href="/usuario">
					<Option active={checkRoute(['/usuario'])}>
						<BiUserCircle />
						<span>Usuário</span>
					</Option>
				</Link>
				<Option active={false} onClick={logOut}>
					<FiLogOut size={25} color="#E2DADB" />
					<span>Sair</span>
				</Option>
				<button className="sync" onClick={() => sync()}>
					<FaSync />
					<span>Sincronizar</span>
				</button>
			</OptionsList>
		</footer>
	)
}

const OfflineIndicator: React.FC = () => {
	return (
		<OfflineIndicatorContainer>
			<RiWifiOffLine />
			<span>Offline</span>
		</OfflineIndicatorContainer>
	)
}

export default Menu
