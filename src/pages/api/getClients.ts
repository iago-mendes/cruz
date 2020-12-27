import {NextApiHandler} from "next"

import api from "../../services/api"

const getClients: NextApiHandler = async (req, res) =>
{
	let clients = []
	await api.get('clients').then(({data}) => clients = data)

	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify(clients))
}

export default getClients