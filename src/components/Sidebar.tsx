import { useState } from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {ProSidebar, SidebarHeader, SidebarContent, SidebarFooter, Menu, MenuItem} from 'react-pro-sidebar'
import 'react-pro-sidebar/dist/css/styles.css'
import {BiBuildings, BiLineChart, BiSpreadsheet, BiUserCircle} from 'react-icons/bi'
import {FiUsers, FiLogOut} from 'react-icons/fi'
import {FaStore} from 'react-icons/fa'
import {signOut} from 'next-auth/client'

import styles from '../styles/components/sidebar.module.css'
import Logo from '../assets/logo.svg'

export default function Sidebar()
{
	const Router = useRouter()
		const [isCollapsed, setIsCollapsed] = useState(true)

		if (Router.pathname === '/login') return null

		function checkRoute(route: string)
		{
			const current = Router.pathname.split('/')
			if (`/${current[1]}` === route) return "#CC9749"
			else return "#E2DADB"
		}

		return (
			<div
				className="sidebar"
				onMouseEnter={() => setIsCollapsed(false)}
				onMouseLeave={() => setIsCollapsed(true)}
			>
				<ProSidebar collapsed={isCollapsed} className={styles.sidebarContainer} >
						<SidebarHeader className={styles.header}>
							<img src={Logo} alt="Cruz Representações" />
						</SidebarHeader>
						<SidebarContent className={styles.content}>
								<Menu>
										<MenuItem
												icon={<BiLineChart size={25} color={checkRoute('/')}/>}
												className={styles.item}
										>
												<Link href="/">Indicadores</Link>
										</MenuItem>
										<MenuItem
												icon={<BiSpreadsheet size={25} color={checkRoute('/pedidos')}/>}
												className={styles.item}
										>
												<Link href="/pedidos">Pedidos</Link>
										</MenuItem>
										<MenuItem
												icon={<FaStore size={25} color={checkRoute('/clientes')}/>}
												className={styles.item}
										>
												<Link href="/clientes">Clientes</Link>
										</MenuItem>
										<MenuItem
												icon={<BiBuildings size={25} color={checkRoute('/empresas')}/>}
												className={styles.item}
										>
												<Link href="/empresas">Empresas</Link>
										</MenuItem>
										<MenuItem
												icon={<FiUsers size={25} color={checkRoute('/vendedores')}/>}
												className={styles.item}
										>
												<Link href="/vendedores">Vendedores</Link>
										</MenuItem>
								</Menu>
						</SidebarContent>
						<SidebarFooter className={styles.footer}>
								<Menu>
										<MenuItem
												icon={<BiUserCircle size={25} color={checkRoute('/usuario')}/>}
												className={styles.item}
										>
												<Link href="/usuario">Usuário</Link>
										</MenuItem>
										<MenuItem
												icon={<FiLogOut size={25} color="#E2DADB"/>}
												className={styles.item}
										>
												<a onClick={() => signOut({callbackUrl: '/login'})}>Sair</a>
										</MenuItem>
								</Menu>
						</SidebarFooter>
				</ProSidebar>
			</div>
		)
}