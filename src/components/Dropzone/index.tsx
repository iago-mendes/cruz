import React, {useCallback, useState, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'
import {FiUpload} from 'react-icons/fi'
import Compressor from 'compressorjs'

import Container from './styles'
import {Image} from '../Image'
import {catchError} from '../../utils/catchError'
import Loading from '../Loading'

interface Props {
	shownFileUrl?: string
	onFileUploaded: (file: File) => void

	name?: string
	id?: string
}

const Dropzone: React.FC<Props> = ({
	shownFileUrl,
	onFileUploaded,
	name,
	id
}) => {
	const [selectedFileUrl, setSelectedFileUrl] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (shownFileUrl) setSelectedFileUrl(shownFileUrl)
	}, [shownFileUrl])

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0]
			handleUploadImage(file)
		},
		[onFileUploaded]
	)

	const {getRootProps, getInputProps} = useDropzone({
		onDrop,
		accept: 'image/*'
	})

	async function handleUploadImage(file: File) {
		setLoading(true)

		await new Promise((resolve, reject) => {
			new Compressor(file, {
				quality: 0.6,
				convertSize: 2000000, // 2mb
				success: blobResult => {
					const fileResult = new File([blobResult], file.name, {
						type: 'image/png'
					})
					resolve(fileResult)
				},
				error: error => reject(error)
			})
		})
			.then((fileResult: File) => {
				const fileUrl = URL.createObjectURL(fileResult)
				setSelectedFileUrl(fileUrl)

				onFileUploaded(fileResult)
			})
			.catch(() => {
				catchError('Erro ao comprimir imagens.')
			})

		setLoading(false)
	}

	return (
		<Container {...getRootProps()}>
			{loading ? (
				<Loading />
			) : (
				<>
					<input {...getInputProps()} accept="image/*" name={name} id={id} />
					{selectedFileUrl !== '' ? (
						<Image src={selectedFileUrl} alt="Image thumbnail" />
					) : (
						<p>
							<FiUpload />
							Selecione uma imagem
						</p>
					)}
				</>
			)}
		</Container>
	)
}

export default Dropzone
