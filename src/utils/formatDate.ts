export default function formatDate(hash: string)
{
	const date = hash.split('T')[0].split('-').map(s => Number(s))
	const formatedDate = `${date[2]}/${date[1]}/${date[0]}`

	return formatedDate
}