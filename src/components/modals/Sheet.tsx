import {useState} from 'react'
import {FaDownload} from 'react-icons/fa'
import {FiCheck, FiX} from 'react-icons/fi'
import {SiGooglesheets} from 'react-icons/si'
import XLSX from 'xlsx'

import Container, {OpenSheetButton} from '../../styles/components/modals/Sheet'
import ModalContainer from './Container'
import api from '../../services/api'

const fileTypes =
[
	'xlsx',
	'xls',
	'xml',
	'csv',
	'ods',
].map(function(x) { return '.' + x }).join(',')

interface SheetModalProps
{
	headerPath: string
	uploadPath: string

	sheetName: string
	fileName: string
}

const SheetModal: React.FC<SheetModalProps> = ({headerPath, uploadPath, sheetName, fileName}) =>
{
	const [isOpen, setIsOpen] = useState(false)
	const [sheet, setSheet] = useState<File>()

	async function getModel()
	{
		const header: string[] = await api.get(headerPath).then(res => res.data)

		let data: string[][] = []
		data[0] = header

		for (let i = 0; i < 10; i++)
		{
			let row: string[] = []

			for (let j = 0; j < header.length; j++)
				row.push('')
			
			data.push(row)
		}

		const wsCols = header.map(col =>
		{
			let width = 10

			if (col.split(' ')[0] === 'Tabela')
				width = 20
			
			return {wch: width}
		})

		const ws = XLSX.utils.aoa_to_sheet(data)
		ws['!cols'] = wsCols
		
		const wb = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(wb, ws, sheetName)

		XLSX.writeFile(wb, `${fileName}.xlsx`)
	}

	function handleSubmit()
	{
		const reader = new FileReader()
		const rABS = !!reader.readAsBinaryString

		reader.onload = (e) =>
		{
			const bstr = e.target.result
			const wb = XLSX.read(bstr, {type: rABS ? 'binary' : 'array'})
			
			const wsname = wb.SheetNames[0]
			const ws = wb.Sheets[wsname]
			
			const data = XLSX.utils.sheet_to_json(ws)

			console.log('[data]', data)
		}

		if(rABS)
			reader.readAsBinaryString(sheet)
		else
			reader.readAsArrayBuffer(sheet)
	}

	return (
		<>
			<ModalContainer
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			>
				<Container>
					<button className='model' onClick={getModel} >
						<FaDownload />
						<span>
							Baixar modelo
						</span>
					</button>
					<form onSubmit={e => e.preventDefault()} >
						<label htmlFor='sheet'>Planilha</label>
						<input
							type='file'
							name='sheet'
							id='sheet'
							accept={fileTypes}
							onChange={e => setSheet(e.target.files[0])}
						/>
					</form>
					
					<div className='buttons'>
						<button type='button' onClick={() => setIsOpen(false)} className='cancel' >
							<FiX size={25} />
							Cancelar
						</button>
						<button type='submit' className='submit' onClick={handleSubmit} >
							<FiCheck size={25} />
							Confirmar
						</button>
					</div>
				</Container>
			</ModalContainer>

			<OpenSheetButton title='Planilha' onClick={() => setIsOpen(true)} >
				<SiGooglesheets />
			</OpenSheetButton>
		</>
	)
}

export default SheetModal