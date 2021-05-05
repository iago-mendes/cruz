import Menu from '../components/Menu'
import {Provider} from 'next-auth/client'
import {ThemeProvider} from 'styled-components'

import theme from '../styles/theme'
import SessionHandler from '../components/SessionHandler'
import GlobalStyle from '../styles/global'

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ThemeProvider theme={theme}>
				<SessionHandler>
					<Menu/>
					<Component {...pageProps} />
				</SessionHandler>
				<GlobalStyle />
			</ThemeProvider>
    </Provider>
  )
}

export default MyApp