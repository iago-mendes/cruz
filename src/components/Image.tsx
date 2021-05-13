import offline from '../assets/offline.svg'

type ImageProps =
{
	src: string
	alt: string
}

export const Image: React.FC<ImageProps> = ({src, alt}) =>
{
	if (!navigator.onLine)
		return (
			<img src={offline} alt={alt} />
		)

	return (
		<img src={src} alt={alt} />
	)
}