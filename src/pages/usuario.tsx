import {useEffect, useState} from 'react'
import Head from 'next/head'

import Container from '../styles/pages/usuario'
import Header from '../components/Header'
import Dropzone from '../components/Dropzone'
import useAuth from '../hooks/useAuth'
import {SkeletonLoading} from '../utils/skeletonLoading'
import {sellerController} from '../services/offline/controllers/seller'
import PasswordModal from '../components/_modals/Password'
import api from '../services/api'
import successAlert from '../utils/alerts/success'
import {catchError} from '../utils/catchError'
import LoadingModal from '../components/_modals/Loading'

const User: React.FC = () => {
	const {user} = useAuth()

	const [imageUrl, setImageUrl] = useState(user.data ? user.data.image : '')
	const [name, setName] = useState(user.data ? user.data.name : '')
	const [title, setTitle] = useState('')
	const [email, setEmail] = useState(user.data ? user.data.email : '')

	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		sellerController.rawOne(user.id).then(seller => {
			if (!seller) return

			setImageUrl(seller.imagem)
			setName(seller.nome)
			setTitle(seller.funcao)
			setEmail(seller.email)
		})
	}, [user.id])

	async function updateImage(file: File) {
		const data = new FormData()
		data.append('imagem', file)

		setLoading(true)
		await api
			.put(`sellers/${user.id}`, data)
			.then(() => successAlert('Imagem atualizada com sucesso!'))
			.catch(catchError)

		setLoading(false)
	}

	return (
		<Container className="container">
			<Head>
				<title>Usuário | Cruz Representações</title>
			</Head>

			<PasswordModal
				isOpen={isPasswordModalOpen}
				setIsOpen={setIsPasswordModalOpen}
				id={user.id}
				role="seller"
			/>

			<LoadingModal isOpen={loading} />

			<Header display="Usuário" />

			<main>
				<div className="img">
					{imageUrl === '' ? (
						<SkeletonLoading height="30rem" width="40rem" />
					) : (
						<Dropzone onFileUploaded={updateImage} shownFileUrl={imageUrl} />
					)}
				</div>

				<div className="group">
					<div className="info">
						<h3>Nome</h3>
						{name === '' ? (
							<SkeletonLoading height="2rem" width="15rem" />
						) : (
							<span>{name}</span>
						)}
					</div>
					<div className="info">
						<h3>Função</h3>
						{title === '' ? (
							<SkeletonLoading height="2rem" width="15rem" />
						) : (
							<span>{title}</span>
						)}
					</div>
				</div>
			</main>

			<div className="credentials">
				<div className="info">
					<h3>E-mail</h3>
					{email === '' ? (
						<SkeletonLoading height="2rem" width="20rem" />
					) : (
						<span>{email}</span>
					)}
				</div>
				<div className="info">
					<h3>Senha</h3>
					<button
						className="password"
						onClick={() => setIsPasswordModalOpen(true)}
					>
						Atualizar senha
					</button>
				</div>
			</div>
		</Container>
	)
}

export default User
