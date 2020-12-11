import Head from 'next/head'

import Container from '../../styles/pages/vendedores/index'

const Sellers: React.FC = () =>
{
  return (
    <Container className='container'>
      <Head>
        <title>Vendedores | Cruz Representações</title>
      </Head>
      <h1>Vendedores</h1>
    </Container>
  )
}

export default Sellers