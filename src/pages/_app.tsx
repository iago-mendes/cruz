import Sidebar from '../components/Sidebar'
import {Provider} from 'next-auth/client'
import {ThemeProvider} from 'styled-components'

import theme from '../styles/theme'
import LoginHandler from '../components/LoginHandler'
import GlobalStyle from '../styles/global'

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ThemeProvider theme={theme}>
				<LoginHandler>
					<Sidebar/>
					<Component {...pageProps} />
				</LoginHandler>
				<GlobalStyle />
			</ThemeProvider>
    </Provider>
  )
}

export default MyApp
