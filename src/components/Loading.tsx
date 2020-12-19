import {CSSProperties} from 'styled-components'

import Container from '../styles/components/Loading'

interface LoadingProps
{
	style?: CSSProperties
}

const Loading: React.FC<LoadingProps> = ({style}) =>
{
	return (
		<Container style={style}>
			<svg>
				<circle
					cx='25'
					cy='25'
					r='20'
					fill='none'
					strokeWidth='4'
				/>
			</svg>
		</Container>
	)
}

export default Loading