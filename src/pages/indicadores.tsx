import Head from 'next/head'

import Header from '../components/Header'

const Indicators: React.FC = () =>
{
	return (
		<div className='container' >
			<Head>
				<title>Indicadores | Cruz Representações</title>
			</Head>

			<Header
				display='Indicadores'
			/>
		</div>
	)
}

export default Indicators