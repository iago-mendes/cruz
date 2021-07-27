import {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import Compressor from 'compressorjs'
import {FiUpload, FiX} from 'react-icons/fi'

import {Container} from './styles'
import FormButtons from '../../FormButtons'
import ModalContainer from '../Container'
import errorAlert from '../../../utils/alerts/error'
import Loading from '../../Loading'
import {Image} from '../../Image'

type Props = {
	isOpen: boolean
	setIsOpen: (p: boolean) => void

	companyId: string
}

const UpdateProductsImageModal: React.FC<Props> = ({isOpen, setIsOpen}) => {
	const [imageFiles, setImageFiles] = useState<File[]>([])
	const [loading, setLoading] = useState(false)

	const onDrop = useCallback((acceptedFiles: File[]) => {
		handleUploadImages(acceptedFiles)
	}, [])

	const {getRootProps, getInputProps} = useDropzone({
		onDrop,
		accept: 'image/*'
	})

	async function handleUploadImages(files: File[]) {
		setLoading(true)

		await Promise.all(
			files.map(async file => {
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

						addImage(fileResult)
					})
					.catch(() => {
						errorAlert(`Erro ao comprimir ${file.name}.`)
					})
			})
		)

		setLoading(false)
	}

	function addImage(file: File) {
		setImageFiles(prev => [...prev, file])
	}

	function handleRemoveImage(index: number) {
		const tmpImageFiles = [...imageFiles]
		tmpImageFiles.splice(index, 1)
		setImageFiles(tmpImageFiles)
	}

	function handleCancel() {
		setIsOpen(false)
	}

	function handleSubmit() {}

	return (
		<ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
			<Container>
				<h1>Atualização de imagens</h1>

				<div className="content">
					<div className="dropzone" {...getRootProps()}>
						{loading ? (
							<Loading />
						) : (
							<>
								<input {...getInputProps()} accept="image/*" name="dropzone" />
								<p>
									<FiUpload />
									Selecione as imagens
								</p>
							</>
						)}
					</div>

					<ul className="images">
						{imageFiles.map((image, index) => (
							<li key={image.name}>
								<button
									onClick={() => handleRemoveImage(index)}
									title="Remover"
								>
									<FiX />
								</button>

								<figure>
									<Image src={URL.createObjectURL(image)} alt={image.name} />
								</figure>

								<span>{image.name}</span>
							</li>
						))}
					</ul>
				</div>

				<FormButtons handleCancel={handleCancel} handleSubmit={handleSubmit} />
			</Container>
		</ModalContainer>
	)
}

export default UpdateProductsImageModal
