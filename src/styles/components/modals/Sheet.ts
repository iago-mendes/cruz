import styled from 'styled-components'

export const OpenSheetButton = styled.button`
	position: fixed;
	bottom: calc(2rem + 5rem + 2rem);
	right: 2rem;
	
	width: 5rem;
	height: 5rem;
	border-radius: 100rem;
	border: none;
	
	background-color: ${p => p.theme.colors.buttonGreen};
	color: ${p => p.theme.colors.background};
	
	cursor: pointer;
	transition: 0.25s;

	:hover
	{
		transform: scale(1.1);
	}

	svg
	{
		font-size: 3rem;
	}
`
const Container = styled.main`
	background-color: green;
`

export default Container