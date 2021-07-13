import React, {useCallback, useState, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'

import {Image} from '../Image'

type Props = {
	shownFileUrl?: string
	onFileUploaded: (file: File) => void
}

export function TableDropzone({shownFileUrl, onFileUploaded}: Props) {
	const [selectedFileUrl, setSelectedFileUrl] = useState('')

	useEffect(() => {
		if (shownFileUrl) setSelectedFileUrl(shownFileUrl)
	}, [shownFileUrl])

	const onDrop = useCallback(
		acceptedFiles => {
			const file = acceptedFiles[0]
			const fileUrl = URL.createObjectURL(file)
			setSelectedFileUrl(fileUrl)
			onFileUploaded(file)
		},
		[onFileUploaded]
	)

	const {getRootProps, getInputProps} = useDropzone({
		onDrop,
		accept: 'image/*'
	})

	return (
		<div
			{...getRootProps()}
			title="Selecionar imagem"
			style={{cursor: 'pointer'}}
		>
			<input {...getInputProps()} accept="image/*" />
			<Image src={selectedFileUrl} alt="Image thumbnail" />
		</div>
	)
}
