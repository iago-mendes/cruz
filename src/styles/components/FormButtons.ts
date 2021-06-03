import styled from 'styled-components'

const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;

	width: 100%;

	button
	{
		font-family: Ubuntu;
		font-size: 1.75rem;
		font-weight: 700;
		background-color: ${p => p.theme.colors.primaryDark};

		color: #fff;

		display: flex;
		align-items: center;
		gap: 1rem;

		padding: 1rem 2rem;
		
		border: none;
		border-radius: 0.5rem;
		
		cursor: pointer;
		transition: 0.25s;

		:hover
		{
			border-radius: 0;
		}
	}

	.submit:hover
	{
		background-color: ${p => p.theme.colors.buttonGreen};
	}

	.cancel:hover
	{
		background-color: ${p => p.theme.colors.buttonRed};
	}

	@media (max-width: 1000px)
	{
		flex-direction: column-reverse;
		gap: 1rem;
	}
`

export default Container