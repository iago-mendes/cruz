import styled from 'styled-components'

const Container = styled.button`
	position: absolute;
	bottom: 2rem;
	right: 2rem;
	
	width: 5rem;
	height: 5rem;
	border-radius: 100rem;
	border: none;
	
	background-color: ${p => p.theme.colors.primary};
	color: ${p => p.theme.colors.background};
	
	cursor: pointer;
	transition: 0.25s;

	:hover
	{
		transform: scale(1.1);
	}
`

export default Container