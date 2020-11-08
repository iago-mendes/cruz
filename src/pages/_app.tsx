import ContextProvider from '../components/ContextProvider'
import Sidebar from '../components/sidebar'

import '../styles/global.css'
import '../styles/pages/login.css'

function MyApp({ Component, pageProps }) {
  return (
    <ContextProvider role={pageProps.role}>
      <Sidebar/>
      <Component {...pageProps} />
    </ContextProvider>
  )
}

export default MyApp
