import errorAlert from '../../utils/alerts/error'
import successAlert from '../../utils/alerts/success'
import api from '../api'

export async function createRequest(data: unknown, callback?: () => void)
{
	await api.post('requests', data)
		.then(() =>
		{
			successAlert('Pedido criado com sucesso!')

			if (callback)
				callback()
		})
		.catch(err =>
		{
			console.error(err)
			errorAlert('Algo errado aconteceu!')
		})
}

export async function updateRequest(id: string, data: unknown, callback?: () => void)
{
	await api.put(`requests/${id}`, data)
		.then(() =>
		{
			successAlert('Pedido atualizado com sucesso!')

			if (callback)
				callback()
		})
		.catch(err =>
		{
			console.error(err)
			errorAlert('Algo errado aconteceu!')
		})
}