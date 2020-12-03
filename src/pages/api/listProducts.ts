import {NextApiHandler} from "next"

import api from "../../services/api"

const search: NextApiHandler = async (req, res) =>
{
	const {company, line} = req.query
	let products = []
	await api.get(`companies/${company}/lines/${line}/products-raw`).then(res => products = res.data)

	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify(products))
}

export default search