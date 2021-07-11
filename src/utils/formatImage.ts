import {apiUrl} from '../services/api'

export default function formatImage(filename: string | undefined) {
	if (!filename || filename === `${apiUrl}/assets/no-image.svg`)
		return `${apiUrl}/public/images/no-image.png`
	else if (filename.includes('http')) return filename
	else return `${apiUrl}/uploads/${filename}`
}

export async function formatImageToDataUrl(url: string) {
	const dataUrl = await fetch(url)
		.then(response => response.blob())
		.then(
			blob =>
				new Promise((resolve, reject) => {
					const reader = new FileReader()
					reader.onloadend = () => resolve(reader.result)
					reader.onerror = reject
					reader.readAsDataURL(blob)
				})
		)

	return dataUrl
}
