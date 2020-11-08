import ContextProvider from '../components/ContextProvider'
import Sidebar from '../components/sidebar'

import '../styles/global.css'
import '../styles/pages/login.css'

function MyApp({ Component, pageProps }) {
  return (
    <ContextProvider>
      <Sidebar/>
      <Component {...pageProps} />
    </ContextProvider>
  )
}

export default MyApp
