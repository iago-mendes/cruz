import { useEffect } from 'react'
import Sidebar from '../components/sidebar'
import '../styles/global.css'

import {User, UserInterface, defaultUser} from '../utils/userContext'

function MyApp({ Component, pageProps }) {
  let user = defaultUser
  useEffect(() =>
  {
    const savedUser = localStorage && localStorage.getItem('@cruz-representacoes/user')
    if (savedUser)
    {
      const tmp: UserInterface = JSON.parse(savedUser)
      user.token = tmp.token
      user.id = tmp.id
      user.role = tmp.role
    }
  }, [])

  return (
    <User.Provider value={user}>
      <Sidebar/>
      <Component {...pageProps} />
    </User.Provider>
  )
}

export default MyApp
