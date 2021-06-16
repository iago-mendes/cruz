import api from '../../services/api'
import confirmAlert from '../alerts/confirm'
import successAlert from '../alerts/success'
import { catchError } from '../catchError'
import formatDate from '../formatDate'

export function handleDeleteRequest(id: string, date: string, callback = () => {})
{
	confirmAlert(
		'Você tem certeza?',
		`Se você continuar, o pedido feito em ${formatDate(date)} será deletado!`,
		() => api.delete(`requests/${id}`)
			.then(() =>
			{
				callback()
				successAlert('Pedido deletado com sucesso!')
			})
			.catch(catchError)
	)
}