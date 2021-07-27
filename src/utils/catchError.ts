import errorAlert from './alerts/error'

export function catchError(error: any) {
	if (!navigator.onLine) return

	console.log('<< error >>', error)

	if (error && error.response && error.response.data)
		errorAlert(error.response.data.message)
	else errorAlert()
}
