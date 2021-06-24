import {pdfController} from '../../services/offline/controllers/pdf'
import {catchError} from '../catchError'

export async function handleSeeRequestPDF(
	id: string,
	setLoading?: (loading: boolean) => void
) {
	if (setLoading) setLoading(true)

	await pdfController.request(id).catch(catchError)

	if (setLoading) setLoading(false)
}
