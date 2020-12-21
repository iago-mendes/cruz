import styled from 'styled-components'

const Container = styled.div`
	width: 100%;
	height: 30rem;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${p => p.theme.colors.background};
	border-radius: 1rem;
	outline: 0;
	cursor: pointer;
	transition: 0.25s;

	:hover
	{
		transform: scale(1.01);
	}

	img
	{
		max-width: 100%;
		max-height: 100%; 
		object-fit: cover;
	}

	p
	{
		width: calc(100% - 6rem);
		height: calc(100% - 6rem);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: ${p => p.theme.colors.primary} 1px dashed;
		border-radius: 1rem;
		color: ${p => p.theme.colors.primary};
		font-family: Ubuntu;
		font-size: 2rem;
		font-weight: bold;
		
		svg
		{
			width: 2.5rem;
			height: 2.5rem;
			/* margin-bottom: 8rem; */
			color: ${p => p.theme.colors.primary};
		}
	}
`

export default Container