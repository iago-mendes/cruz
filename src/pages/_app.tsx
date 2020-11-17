// import ContextProvider from '../components/ContextProvider'
import Sidebar from '../components/Sidebar'
import {Provider} from 'next-auth/client'

import '../styles/global.css'
import '../styles/pages/login.css'
import '../styles/pages/empresas/index.css'
import '../styles/pages/empresas/[company]/index.css'
import '../styles/pages/empresas/[company]/editar.css'

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Sidebar/>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
