import styled from 'styled-components'

const Container = styled.button`
	position: fixed;
	bottom: 2rem;
	right: 2rem;
	
	width: 5rem;
	height: 5rem;
	border-radius: 100rem;
	border: none;
	
	background-color: ${p => p.theme.colors.primary};
	color: ${p => p.theme.colors.background};
	box-shadow: 0px 0px 10px #000;
	
	cursor: pointer;
	transition: 0.25s;

	:hover
	{
		transform: scale(1.1);
	}

	@media (max-width: 1000px)
	{
		bottom: 1rem;
		right: 1rem;	
	}
`

export default Container