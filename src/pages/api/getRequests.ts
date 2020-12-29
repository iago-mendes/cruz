import {NextApiHandler} from "next"

import api from "../../services/api"

const getRequests: NextApiHandler = async (req, res) =>
{
	let requests = []
	await api.get('requests').then(({data}) => requests = data)

	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify(requests))
}

export default getRequests