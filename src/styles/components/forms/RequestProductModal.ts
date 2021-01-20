import styled from 'styled-components'

const Container = styled.div`
	width: 75vw;
	height: 75vh;

	background-color: ${p => p.theme.colors.background};
	border-radius: 1rem;

	header
	{
		background-color: ${p => p.theme.colors.primary};
		padding: 0.5rem;
		border-top-left-radius: 1rem;
		border-top-right-radius: 1rem;

		display: flex;
		flex-direction: column;
		align-items: flex-end;

		button
		{
			background: none;
			border: none;
			border-radius: 100rem;

			width: 3rem;
			height: 3rem;
			color: ${p => p.theme.colors.secondary};

			display: flex;
			align-items: center;
			justify-content: center;

			transition: 0.25s;
			cursor: pointer;

			:hover
			{
				background-color: ${p => p.theme.colors.secondary};
				color: ${p => p.theme.colors.primary};
			}
		}
	}

	form
	{
		padding: 1rem;
	}
`

export default Container