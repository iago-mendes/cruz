import {Container} from './styles'

type Props = {
	height?: number | string
	width?: number | string

	showAnimation?: boolean
}

export function SkeletonLoading({height, width, showAnimation = true}: Props) {
	return (
		<Container height={height} width={width} showAnimation={showAnimation} />
	)
}
