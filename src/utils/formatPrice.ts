function priceToString(p: number) {
	const {format} = new Intl.NumberFormat('pt-BR', {
		style: 'decimal',
		maximumFractionDigits: 2,
		minimumFractionDigits: 2
	})

	return format(p)
}

function priceToNumber(p: string) {
	const [integers, decimals] = p
		.split(',')
		.map(str => Number(str.replace('/D/g', '')))

	const price = decimals ? Number(integers + '.' + decimals) : integers
	const res = !Number.isNaN(price) ? price : 0

	return res
}

function formatPrice(price: number | string, showSymbol = true) {
	if (typeof price === 'string') return priceToNumber(price)
	else if (typeof price === 'number') {
		if (showSymbol) return 'R$ ' + priceToString(price)
		else return priceToString(price)
	}
}

export default formatPrice
