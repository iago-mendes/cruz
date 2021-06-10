import Head from 'next/head'
import {useEffect, useState} from 'react'
import {FiEdit3, FiTrash} from 'react-icons/fi'
import {useRouter} from 'next/router'

import Container from '../../styles/pages/vendedores/index'
import api from '../../services/api'
import Loading from '../../components/Loading'
import Add from '../../components/Add'
import NotAllowed from '../../components/NotAllowed'
import Header from '../../components/Header'
import useAuth from '../../hooks/useAuth'
import confirmAlert from '../../utils/alerts/confirm'
import successAlert from '../../utils/alerts/success'
import { Image } from '../../components/Image'
import { loadingSeller, SellerRaw } from '../../models/seller'
import { sellerController } from '../../services/offline/controllers/seller'
import { SkeletonLoading } from '../../utils/skeletonLoading'

interface SellersProps
{
	sellers: SellerRaw[]
}

const Sellers: React.FC<SellersProps> = () =>
{
	const {user, loading} = useAuth()
	const Router = useRouter()

	const defaultSellers: SellerRaw[] = Array(9).fill(loadingSeller)
	const [sellers, setSellers] = useState<SellerRaw[]>(defaultSellers)

	useEffect(() =>
	{
		updateSellers()
	}, [])

	if (loading)
		return <Loading />
	if (user.role !== 'admin')
		return <NotAllowed />
	
	async function updateSellers()
	{
		await sellerController.raw()
			.then(data =>
			{
				setSellers(data)
			})
			.catch(error =>
			{
				console.log('<< error >>', error)
				setSellers([])
			})
	}

	async function handleDeleteSeller(seller: SellerRaw)
	{
		confirmAlert(
			'Você tem certeza?',
			`Se você continuar, o vendedor ${seller.nome} será deletado!`,
			() => api.delete(`sellers/${seller._id}`)
				.then(() =>
				{
					updateSellers()
					successAlert(`Vendedor ${seller.nome} deletado com sucesso!`)
				})
		)
	}

	return (
		<Container className='container'>
			<Head>
				<title>Vendedores | Cruz Representações</title>
			</Head>

			<Add route='/vendedores/adicionar' />

			<Header display='Vendedores' />

			<main>
				{sellers.map((seller, index) =>
				{
					if (seller._id === 'loading')
						return (
							<div key={index} className='seller' >
								<SkeletonLoading height='9rem' width='9rem' />
								<div className='texts'>
									<SkeletonLoading height='2.5rem' width='15rem' />
									<SkeletonLoading height='2rem' width='15rem' />
									<SkeletonLoading height='1.5rem' width='15rem' />
								</div>
							</div>
						)
					else
						return (
							<div key={index} className={`seller ${seller.admin && 'admin'}`}>
								{
									user.role === 'admin' && (
										<div className='buttons'>
											<button title='Editar' onClick={() => Router.push(`/vendedores/${seller._id}`)} >
												<FiEdit3 size={15} />
											</button>
											<button title='Deletar' onClick={() => handleDeleteSeller(seller)} >
												<FiTrash size={15} />
											</button>
										</div>
									)
								}
								<Image src={seller.imagem} alt={seller.nome} />
								<div className='texts'>
									<h1>
										{seller.nome}
									</h1>
									<h2>{seller.funcao}</h2>
									<h3>{seller.email}</h3>
								</div>
							</div>
						)
				})}
			</main>
		</Container>
	)
}

export default Sellers