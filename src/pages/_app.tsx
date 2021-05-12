import Menu from '../components/Menu'
import {ThemeProvider} from 'styled-components'

import theme from '../styles/theme'
import SessionHandler from '../components/SessionHandler'
import GlobalStyle from '../styles/global'
import AuthContextProvider from '../contexts/Auth'

function MyApp({ Component, pageProps }) {
	return (
		<AuthContextProvider>
			<ThemeProvider theme={theme}>
				<SessionHandler>
					<Menu/>
					<Component {...pageProps} />
				</SessionHandler>
				<GlobalStyle />
			</ThemeProvider>
		</AuthContextProvider>
	)
}

export default MyApp