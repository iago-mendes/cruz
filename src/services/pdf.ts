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

	pdfMake.createPdf(docDefinition, options).open({})
}