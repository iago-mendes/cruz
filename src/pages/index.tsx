import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Cruz Representações</title>
      </Head>
      <h1>Indicadores</h1>
    </div>
  )
}

export async function getStaticProps(ctx)
{
  return {
    props: {role: 'seller'}
  }
}