import Sidebar from '../components/sidebar'
import '../styles/global.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Sidebar/>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
