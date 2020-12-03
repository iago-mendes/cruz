import {NextApiHandler} from "next"

import api from "../../services/api"

const search: NextApiHandler = async (req, res) =>
{
	const {company} = req.query
	let lines = []
	await api.get(`companies/${company}/lines`).then(res => lines = res.data)

	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify(lines))
}

export default search