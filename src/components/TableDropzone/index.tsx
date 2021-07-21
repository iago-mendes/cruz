import React, {useCallback, useState, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'
import Compressor from 'compressorjs'

import {Image} from '../Image'
import errorAlert from '../../utils/alerts/error'
import Loading from '../Loading'

type Props = {
	shownFileUrl?: string
	onFileUploaded: (file: File) => void
}

export function TableDropzone({shownFileUrl, onFileUploaded}: Props) {
	const [selectedFileUrl, setSelectedFileUrl] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (shownFileUrl) setSelectedFileUrl(shownFileUrl)
	}, [shownFileUrl])

	const onDrop = useCallback(
		acceptedFiles => {
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
				convertSize: 2 * 1024 * 1024, // 2mb
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
				if (fileResult.size > 2 * 1024 * 1024)
					return errorAlert(
						'O limite de upload é 2mb por arquivo.',
						'Imagem muito grande!'
					)

				const fileUrl = URL.createObjectURL(fileResult)
				setSelectedFileUrl(fileUrl)

				onFileUploaded(fileResult)
			})
			.catch(() => {
				errorAlert('Erro ao comprimir imagens.')
			})

		setLoading(false)
	}

	return (
		<div
			{...getRootProps()}
			title="Selecionar imagem"
			style={{cursor: 'pointer'}}
		>
			{loading ? (
				<Loading />
			) : (
				<>
					<input {...getInputProps()} accept="image/*" />
					<Image src={selectedFileUrl} alt="Image thumbnail" />
				</>
			)}
		</div>
	)
}
