import {NextApiHandler} from "next"

import api from "../../services/api"

const search: NextApiHandler = async (req, res) =>
{
	let sellers = []
	await api.get('sellers-raw').then(({data}) => sellers = data)

	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify(sellers))
}

export default search