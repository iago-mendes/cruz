export function getRandomString(display = '')
{
	const random = display + '_' + Math.random().toString(36).substr(2, 9)
	return random
}