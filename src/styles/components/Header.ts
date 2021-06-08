import styled from 'styled-components'

const Container = styled.header`
	width: 100%;
	height: 6.5rem;
	background: #fff;

	padding: 0 5rem;

	display: flex;
	align-items: center;
	justify-content: space-between;

	box-shadow: 0px 5px 10px rgba(0,0,0,0.25);

	.display
	{
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;

		h1
		{
			font-family: Ubuntu;
			font-size: 2rem;
		}
	}

	.inputField
	{
		height: 60%;
		width: 25rem;

		border: rgba(138, 138, 138, 0.5) solid 2.5px;
		border-radius: 2rem;

		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;

		padding: 0.5rem;

		transition: 0.25s;

		:hover
		{
			border-color: ${p => p.theme.colors.primary};

			svg
			{
				color: ${p => p.theme.colors.primary};
			}
		}

		svg
		{
			color: rgba(138, 138, 138, 0.5);
			transition: 0.25s;
		}

		input
		{
			width: 100%;
			height: 100%;

			border: none;

			font-family: Roboto;
			font-size: 1.75rem;
		}
	}

	@media (max-width: 1000px)
	{
		padding: 0 1rem;
		gap: 1rem;

		.inputField
		{
			width: 100%;
			max-width: 25rem;
		}
	}
`

export default Container