import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
	DocumentInitialProps
} from 'next/document'
import {ServerStyleSheet} from 'styled-components'

class MyDocument extends Document {
	static async getInitialProps(
		ctx: DocumentContext
	): Promise<DocumentInitialProps> {
		const sheet = new ServerStyleSheet()
		const originalRenderPage = ctx.renderPage

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
				})

			const initialProps = await Document.getInitialProps(ctx)
			return {
				...initialProps,
				styles: (
					<>
						{initialProps.styles}
						{sheet.getStyleElement()}
					</>
				)
			}
		} finally {
			sheet.seal()
		}
	}

	render() {
		const pwa = {
			name: 'Cruz',
			description: 'Excelência em Representação Comercial!'
		}

		return (
			<Html lang="pt">
				<Head>
					<meta charSet="utf-8" />

					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link
						href="https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu&display=swap"
						rel="stylesheet"
					/>

					{/* PWA */}

					<meta name="application-name" content={pwa.name} />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta
						name="apple-mobile-web-app-status-bar-style"
						content="default"
					/>
					<meta name="apple-mobile-web-app-title" content={pwa.name} />
					<meta name="description" content={pwa.description} />
					<meta name="format-detection" content="telephone=no" />
					<meta name="mobile-web-app-capable" content="yes" />
					<meta name="theme-color" content="#84130B" />

					<link rel="apple-touch-icon" sizes="64x64" href="/favicon.svg" />
					<link rel="manifest" href="/manifest.json" />
					<link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
