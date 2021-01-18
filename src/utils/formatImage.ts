import getConfig from 'next/config'

const {publicRuntimeConfig: env} = getConfig()

export default function formatImage(filename: string | undefined)
{
	if (filename)
		return `${env.apiUrl}/uploads/${filename}`
	else
		return `${env.apiUrl}/uploads/assets/no-image.png`
}