import {BiBuildings, BiPlus, BiSearch} from 'react-icons/bi'
import {useRouter} from 'next/router'

import {useSession} from 'next-auth/client'
import Loading from './Loading'
import Container from '../styles/components/CompanyHeader'

interface User
{
	id: string
	role: string
}

interface HeaderProps
{
	display: string
	addRoute?: string
	showSecondGroup?: boolean
}

const Header: React.FC<HeaderProps> = ({display, addRoute = '/', showSecondGroup = false}) =>
{
	const Router = useRouter()
	const [session, loading] = useSession()

	if (loading) return <Loading />

	const {user: tmpUser}:{user: any} = session
	const user: User = tmpUser

  return (
		<Container showSecondGroup={showSecondGroup} >
			<div className="group">
				<BiBuildings size={30} />
				<h1>{display}</h1>
			</div>
			{showSecondGroup && (
				<div className="group">
					{
						user.role === 'admin'
						? (
							<button onClick={() => Router.push(addRoute)}>
								<BiPlus size={30} />
								<span>Adicionar</span>
							</button>
						)
						: <div/>
					}
					<div className="inputField">
						<BiSearch size={25} color='rgb(138, 138, 138)' />
						<input type="text" name="search"/>
					</div>
				</div>
			)}
		</Container>
  )
}

export default Header