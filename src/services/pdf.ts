import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs

export function createPdf(content: any, title: string, options = {})
{
	const docDefinition =
	{
		info:
		{
			title,
			author: 'Cruz Representações'
		},
		content,
		pageMargins: 15,
		defaultStyle:
		{
			fontSize: 10
		},
		images:
		{
			logo: 'https://api.cruzrepresentacoes.com.br/assets/logo.png'
		}
	}

	function openBase64NewTab(base64Pdf: string)
	{
		const blob = base64toBlob(base64Pdf)

		if (window.navigator && window.navigator.msSaveOrOpenBlob)
			window.navigator.msSaveOrOpenBlob(blob, `${title}.pdf`)
		else
		{
			const blobUrl = URL.createObjectURL(blob)
			window.open(blobUrl)
		}
	}

	function base64toBlob(base64Data: string)
	{
		const sliceSize = 1024
		const byteCharacters = atob(base64Data)
		const bytesLength = byteCharacters.length
		const slicesCount = Math.ceil(bytesLength / sliceSize)
		const byteArrays = new Array(slicesCount)

		for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex)
		{
			const begin = sliceIndex * sliceSize
			const end = Math.min(begin + sliceSize, bytesLength)

			const bytes = new Array(end - begin)
			for (let offset = begin, i = 0; offset < end; ++i, ++offset)
				bytes[i] = byteCharacters[offset].charCodeAt(0)
			
			byteArrays[sliceIndex] = new Uint8Array(bytes)
		}
		return new Blob(byteArrays, { type: 'application/pdf' })
	}

	const doc = pdfMake.createPdf(docDefinition, options)
	doc.getBase64((data) => openBase64NewTab(data))
}