export function formatMonth(month: string) {
	const [year, monthNumber] = month.split('-').map(part => Number(part))
	if (Number.isNaN(year) || Number.isNaN(monthNumber)) return undefined

	const monthNames = [
		'Janeiro',
		'Fevereiro',
		'Março',
		'Abril',
		'Maio',
		'Junho',
		'Julho',
		'Agosto',
		'Setembro',
		'Outubro',
		'Novembro',
		'Dezembro'
	]
	const monthName = monthNames[monthNumber - 1]

	const formatedMonth = monthName + ' ' + year
	return formatedMonth
}
