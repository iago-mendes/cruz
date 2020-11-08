import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt">
        <Head>
            <meta charSet="utf-8" />
            <link
                href="https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@700&display=swap"
                rel="stylesheet"
            />
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