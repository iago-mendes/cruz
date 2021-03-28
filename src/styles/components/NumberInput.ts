import styled from 'styled-components'

const Container = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;

	.controller
	{
		width: 3rem !important;
		height: 3rem !important;
		padding: 0 !important;

		background-color: #fff !important;
		color: ${p => p.theme.colors.primaryDark};

		:hover
		{
			background-color: ${p => p.theme.colors.primaryDark} !important;
			color: #fff;
		}
	}

	.numberInput
	{
		width: fit-content;

		span
		{
			font-size: 1.75rem;
		}

		input
		{
			width: 10rem !important;
		}
	}
`

export default Container