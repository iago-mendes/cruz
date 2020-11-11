import ContextProvider from '../components/ContextProvider'
import Sidebar from '../components/sidebar'

import '../styles/global.css'
import '../styles/pages/login.css'
import '../styles/pages/empresas/index.css'
import '../styles/pages/empresas/[company]/index.css'
import '../styles/pages/empresas/[company]/editar.css'

function MyApp({ Component, pageProps }) {
  return (
    <ContextProvider>
      <Sidebar/>
      <Component {...pageProps} />
    </ContextProvider>
  )
}

export default MyApp
