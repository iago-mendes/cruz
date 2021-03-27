interface Request
{
	_id: string
	cliente: string
	vendedor?: string
	representada: string
	produtos: Array<{id: string, quantidade: number, preco: number, linhaId: string}>
	data: string
	condicao: string
	digitado_por?: string
	peso?: number
	volume?: number
	tipo: {venda: boolean, troca: boolean}
	status: {concluido: boolean, enviado: boolean, faturado: boolean}
}

export default Request