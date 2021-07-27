import {useCallback, useState, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'
import Compressor from 'compressorjs'
import {FiUpload, FiX} from 'react-icons/fi'
import Select from 'react-select'

import {Container} from './styles'
import FormButtons from '../../FormButtons'
import ModalContainer from '../Container'
import errorAlert from '../../../utils/alerts/error'
import Loading from '../../Loading'
import {Image} from '../../Image'
import {SelectOption} from '../../../models'
import {selectStyles} from '../../../styles/select'
import {productController} from '../../../services/offline/controllers/product'

type Relation = {
	imageFilename: string
	productId: string
}

type Props = {
	isOpen: boolean
	setIsOpen: (p: boolean) => void

	companyId: string
}

const UpdateProductsImageModal: React.FC<Props> = ({
	isOpen,
	setIsOpen,
	companyId
}) => {
	const [imageFiles, setImageFiles] = useState<File[]>([])
	const [relations, setRelations] = useState<Relation[]>([])

	const [loading, setLoading] = useState(false)
	const [productOptions, setProductOptions] = useState<SelectOption[]>([])

	const selectedProductIds = relations.map(({productId}) => productId)

	useEffect(() => {
		productController.raw(companyId).then(products => {
			const tmpProductOptions: SelectOption[] = products.map(product => ({
				label: `${product.codigo} - ${product.nome}`,
				value: product._id
			}))

			setProductOptions(tmpProductOptions)
		})
	}, [companyId])

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

	function handleRemoveImage(filename: string) {
		setImageFiles(prev => prev.filter(({name}) => name !== filename))
		setRelations(prev =>
			prev.filter(({imageFilename}) => imageFilename !== filename)
		)
	}

	function handleSelectProduct(productId: string, imageFilename: string) {
		setRelations(prev => [
			...prev.filter(
				relation =>
					relation.imageFilename !== imageFilename &&
					relation.productId !== productId
			),
			{imageFilename, productId}
		])
	}

	function handleCancel() {
		setIsOpen(false)
	}

	function handleSubmit() {
		console.log('<< relations >>', relations)
	}

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
						{imageFiles.map(image => {
							const relation = relations.find(
								({imageFilename}) => imageFilename === image.name
							)

							return (
								<li key={image.name}>
									<div className="imageContainer">
										<button
											onClick={() => handleRemoveImage(image.name)}
											title="Remover"
										>
											<FiX />
										</button>

										<figure>
											<Image
												src={URL.createObjectURL(image)}
												alt={image.name}
											/>
										</figure>

										<span>{image.name}</span>
									</div>

									<div className="select">
										<Select
											value={
												relation
													? productOptions.find(
															({value}) => value === relation.productId
													  )
													: undefined
											}
											options={productOptions.filter(
												({value}) => !selectedProductIds.includes(value)
											)}
											onChange={option =>
												handleSelectProduct(option.value, image.name)
											}
											styles={selectStyles}
											placeholder="Selecione o produto"
										/>
									</div>
								</li>
							)
						})}
					</ul>
				</div>

				<FormButtons handleCancel={handleCancel} handleSubmit={handleSubmit} />
			</Container>
		</ModalContainer>
	)
}

export default UpdateProductsImageModal
