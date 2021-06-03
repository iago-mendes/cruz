import styled from 'styled-components'

const Container = styled.main`
	padding: 1rem;

	ul.emails
	{
		display: flex;
		flex-direction: column;
		gap: 1rem;

		li
		{
			display: flex;
			align-items: center;
			gap: 0.5rem;

			label
			{
				font-size: 1.5rem;
			}
		}
	}

	.field
	{
		margin: 2rem 0;
		padding-left: 2rem;

		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		label
		{
			font-family: Ubuntu;
			font-weight: 700;
			font-size: 1.5rem;

			border-left: ${p => p.theme.colors.text} 5px solid;
			padding-left: 1rem;
			margin-left: -2rem;
		}

		textarea
		{
			width: 100%;
			resize: vertical;
			
			border: ${p => p.theme.colors.text}40 2px solid;
			border-radius: 0.5rem;
			padding: 0.5rem;
			
			font-size: 1.5rem;
			font-family: Roboto;

			transition: border 0.25s;

			:focus, :hover
			{
				border-color: ${p => p.theme.colors.primary};
			}
		}
	}
`

export default Container