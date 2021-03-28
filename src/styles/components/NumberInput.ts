import styled from 'styled-components'

const Container = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;

	.numberInput
	{
		width: fit-content;

		span
		{
			font-size: 1.75rem;
		}

		input
		{
			width: 15rem !important;
		}
	}

	.controllers
	{
		display: flex;
		flex-direction: column;

		button
		{
			width: 2.5rem !important;
			height: 2.5rem !important;
			padding: 0 !important;

			border: none;
			border-radius: 0 !important;

			background-color: #fff !important;
			color: ${p => p.theme.colors.primaryDark};

			display: flex;
			align-items: center;
			justify-content: center;

			transition: 0.25s;

			:hover
			{
				background-color: ${p => p.theme.colors.primaryDark} !important;
				color: #fff;
			}
		}
	}
`

export default Container