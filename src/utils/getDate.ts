export default function getDate(showOnlyDate = false)
{
	const dateObj = new Date(Date.now())
	const formatedDate = dateObj.toISOString().replace('T', ' ').replace('Z', '')

	if (showOnlyDate)
	{
		const [onlyDate, ] = formatedDate.split(' ')
		return onlyDate
	}

	return formatedDate
}