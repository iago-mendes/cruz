import Sidebar from '../components/sidebar'
import '../styles/global.css'

import {User, UserInterface, defaultUser} from '../utils/userContext'

function MyApp({ Component, pageProps }) {
  const savedUser = localStorage.getItem('@cruz-representacoes/user')

  let user = defaultUser
  if (savedUser)
  {
    const tmp: UserInterface = JSON.parse(savedUser)
    user.token = tmp.token
    user.id = tmp.id
    user.role = tmp.role
  }

  return (
    <User.Provider value={user}>
      <Sidebar/>
      <Component {...pageProps} />
    </User.Provider>
  )
}

export default MyApp
