import { useState } from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {ProSidebar, SidebarHeader, SidebarContent, SidebarFooter, Menu, MenuItem} from 'react-pro-sidebar'
import 'react-pro-sidebar/dist/css/styles.css'
import {BiBuildings, BiLineChart, BiSpreadsheet, BiUserCircle} from 'react-icons/bi'
import {FiUsers, FiLogOut} from 'react-icons/fi'
import {FaStore} from 'react-icons/fa'

import styles from '../styles/components/sidebar.module.css'
import Logo from '../assets/logo.svg'

export default function Sidebar()
{
    const [isCollapsed, setIsCollapsed] = useState(true)

    const location = useRouter()
    // if (location.pathname === '/login') return null

    // function handleLogout()
    // {
    //     localStorage.removeItem('@cruz-representacoes/user')
    // }

    return (
        <ProSidebar collapsed={isCollapsed} className={styles.sidebarContainer}>
            <SidebarHeader className={styles.header}>
                {/* <div onClick={() => setIsCollapsed(!isCollapsed)}> */}
                    {/* <Logo /> */}
                    <img src={Logo} alt="Cruz Representações" onClick={() => setIsCollapsed(!isCollapsed)}/>
                {/* </div> */}
            </SidebarHeader>
            <SidebarContent className={styles.content}>
                <Menu>
                    <MenuItem
                        icon={<BiLineChart size={25} color={location.pathname === '/' ? "#CC9749" : "#E2DADB"}/>}
                        className={styles.item}
                    >
                        <Link href="/">Indicadores</Link>
                    </MenuItem>
                    <MenuItem
                        icon={<BiSpreadsheet size={25} color={location.pathname === '/pedidos' ? "#CC9749" : "#E2DADB"}/>}
                        className={styles.item}
                    >
                        <Link href="/pedidos">Pedidos</Link>
                    </MenuItem>
                    <MenuItem
                        icon={<FaStore size={25} color={location.pathname === '/clientes' ? "#CC9749" : "#E2DADB"}/>}
                        className={styles.item}
                    >
                        <Link href="/clientes">Clientes</Link>
                    </MenuItem>
                    <MenuItem
                        icon={<BiBuildings size={25} color={location.pathname === '/empresas' ? "#CC9749" : "#E2DADB"}/>}
                        className={styles.item}
                    >
                        <Link href="/empresas">Empresas</Link>
                    </MenuItem>
                    <MenuItem
                        icon={<FiUsers size={25} color={location.pathname === '/vendedores' ? "#CC9749" : "#E2DADB"}/>}
                        className={styles.item}
                    >
                        <Link href="/vendedores">Vendedores</Link>
                    </MenuItem>
                </Menu>
            </SidebarContent>
            <SidebarFooter className={styles.footer}>
                <Menu>
                    <MenuItem
                        icon={<BiUserCircle size={25} color={location.pathname === '/usuario' ? "#CC9749" : "#E2DADB"}/>}
                        className={styles.item}
                    >
                        <Link href="/usuario">Informações</Link>
                    </MenuItem>
                    <MenuItem
                        icon={<FiLogOut size={25} color="#E2DADB"/>}
                        className={styles.item}
                    >
                        <Link href="/login">Sair</Link>
                    </MenuItem>
                </Menu>
            </SidebarFooter>
        </ProSidebar>
    )
}