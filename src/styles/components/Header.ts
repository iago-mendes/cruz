import styled from 'styled-components'

const Container = styled.header`
	width: 100%;
	height: 10vh;
	background: #fff;

	padding-left: 5rem;
	padding-right: 5rem;

	display: flex;
	align-items: center;
	justify-content: space-between;

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
		gap: 1rem;

		padding: 1rem;

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
			font-size: 1.5rem;
		}
	}
`

export default Container