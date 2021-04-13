import {useState} from 'react'
import {FaDownload} from 'react-icons/fa'
import {SiGooglesheets} from 'react-icons/si'
import XLSX from 'xlsx'

import Container, {OpenSheetButton} from '../../styles/components/modals/Sheet'
import ModalContainer from './Container'
import api from '../../services/api'
import successAlert from '../../utils/alerts/success'
import errorAlert from '../../utils/alerts/error'
import useUser from '../../hooks/useUser'
import FormButtons from '../FormButtons'
import LoadingModal from './Loading'

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

	callback?: () => void
}

const SheetModal: React.FC<SheetModalProps> = ({headerPath, uploadPath, sheetName, fileName, callback = () => {}}) =>
{
	const {user} = useUser()

	const [isOpen, setIsOpen] = useState(false)
	const [sheet, setSheet] = useState<File>()
	const [loading, setLoading] = useState(false)

	async function getHeader()
	{
		const header: string[] = await api.get(headerPath).then(res => res.data)
		return header
	}

	async function getModel()
	{
		const header = await getHeader()

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
		setLoading(true)

		const reader = new FileReader()
		const rABS = !!reader.readAsBinaryString

		reader.onload = async (e) =>
		{
			const bstr = e.target.result
			const wb = XLSX.read(bstr, {type: rABS ? 'binary' : 'array'})
			
			const wsname = wb.SheetNames[0]
			const ws = wb.Sheets[wsname]
			
			const data = XLSX.utils.sheet_to_json(ws)
			const header = await getHeader()

			api.post(uploadPath, {header, data})
				.then(() =>
				{
					setLoading(false)
					
					successAlert('Planilha enviada com sucesso!')
					setIsOpen(false)
					callback()
				})
				.catch(err =>
				{
					setLoading(false)

					if (!err.response)
					{
						errorAlert('Erro interno do servidor!')
						return console.error('[error]', err)
					}

					if (!err.response.message)
					{
						errorAlert('Erro interno do servidor!')
						return console.error('[error]', err.response)
					}

					errorAlert(err.response.message.data)
				})
		}

		if(rABS)
			reader.readAsBinaryString(sheet)
		else
			reader.readAsArrayBuffer(sheet)
	}

	if (user.role !== 'admin')
		return null

	return (
		<>
			<ModalContainer
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			>
				<LoadingModal
					isOpen={loading}
				/>

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

					<FormButtons
						handleCancel={() => setIsOpen(false)}
						handleSubmit={handleSubmit}
					/>
				</Container>
			</ModalContainer>

			<OpenSheetButton title='Planilha' onClick={() => setIsOpen(true)} >
				<SiGooglesheets />
			</OpenSheetButton>
		</>
	)
}

export default SheetModal