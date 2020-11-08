import Sidebar from '../components/sidebar'

import '../styles/global.css'
import '../styles/pages/login.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Sidebar/>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
