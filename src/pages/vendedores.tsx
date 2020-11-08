import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Vendedores | Cruz Representações</title>
      </Head>
      <h1>Vendedores</h1>
    </div>
  )
}

export async function getStaticProps(ctx)
{
  return {
    props: {role: 'admin'}
  }
}