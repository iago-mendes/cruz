import offline from '../../assets/images/offline.svg'
import formatImage from '../../utils/formatImage'

type ImageProps = {
	src: string
	alt: string
}

export const Image: React.FC<ImageProps> = ({src, alt}) => {
	if (!navigator.onLine) return <img src={offline} alt={alt} />

	return <img src={formatImage(src)} alt={alt} />
}
