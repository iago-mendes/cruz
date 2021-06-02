import getConfig from 'next/config'

const {publicRuntimeConfig: env} = getConfig()

export default function formatImage(filename: string | undefined)
{
	if (filename)
		return `${env.apiUrl}/uploads/${filename}`
	else
		return `${env.apiUrl}/assets/no-image.png`
}

export async function formatImageToDataUrl(url: string)
{
	const dataUrl = await fetch(url)
		.then((response) => response.blob())
		.then(blob => new Promise((resolve, reject) =>
		{
			const reader = new FileReader()
			reader.onloadend = () => resolve(reader.result)
			reader.onerror = reject
			reader.readAsDataURL(blob)
		}))
	
	return dataUrl
}