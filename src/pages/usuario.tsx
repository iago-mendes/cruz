import Head from 'next/head'

import Container from '../styles/pages/usuario'
import Header from '../components/Header'
import Dropzone from '../components/Dropzone'

const User: React.FC = () =>
{
	return (
		<Container className='container' >
			<Head>
				<title>Usuário | Cruz Representações</title>
			</Head>

			<Header
				display='Usuário'
			/>

			<main>
				<div className='img'>
					<Dropzone
						onFileUploaded={() => {}}
						shownFileUrl={undefined}
					/>
				</div>

				<div className='group'>
					<div className='info'>
						<h3>Nome</h3>
						<span>Iago Mendes</span>
					</div>
					<div className='info'>
						<h3>Função</h3>
						<span>Desenvolvedor</span>
					</div>
				</div>
			</main>

			<div className='credentials'>
				<div className='info'>
					<h3>E-mail</h3>
					<span>contato@iago-mendes.me</span>
				</div>
				<div className='info'>
					<h3>Senha</h3>
					<button className='password' onClick={() => {}} >
						Atualizar senha
					</button>
				</div>
			</div>
		</Container>
	)
}

export default User