import styled from 'styled-components'

export const OpenSheetButton = styled.button`
	position: fixed;
	bottom: calc(2rem + 5rem + 2rem);
	right: 2rem;
	z-index: 1;
	
	width: 5rem;
	height: 5rem;
	border-radius: 100rem;
	border: none;
	
	background-color: ${p => p.theme.colors.buttonGreen};
	color: ${p => p.theme.colors.background};
	box-shadow: 0px 0px 10px #000;
	
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

	@media (max-width: 1000px)
	{
		right: 1rem;
		bottom: calc(1rem + 5rem + 1rem);
	}
`
const Container = styled.main`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;

	padding: 4rem 2rem !important;

	.actions
	{
		display: flex;
		align-items: center;
		gap: 2rem;

		button
		{
			font-family: Ubuntu;
			font-size: 1.75rem;
			font-weight: 700;
			background-color: #fff;

			display: flex;
			align-items: center;
			gap: 1rem;

			padding: 1rem 2rem;
			
			border: none;
			border-radius: 2rem;
			
			cursor: pointer;
			transition: 0.25s;

			:hover
			{
				border-radius: 0;

				background-color: ${p => p.theme.colors.primary};
				color: #fff;
			}
		}
	}

	form
	{
		width: 80%;
		padding: 0 2rem;
		
		display: flex;
		flex-direction: column;
		gap: 1rem;

		label
		{
			font-family: Ubuntu;
			font-weight: 700;
			font-size: 2rem;

			border-left: ${p => p.theme.colors.text} 5px solid;
			padding-left: 1rem;
			margin-left: -2rem;
		}

		input
		{
			font-size: 1.75rem;

			background-color: #fff;
			border-radius: 0.5rem;
			padding: 0.5rem 1rem;

			cursor: pointer;
			transition: 0.25s;
		}
	}

	.buttons
	{
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
			background-color: #fff;

			display: flex;
			align-items: center;
			gap: 1rem;

			padding: 1rem 2rem;
			
			border: none;
			border-radius: 2rem;
			
			cursor: pointer;
			transition: 0.25s;

			:hover
			{
				transform: scale(1.1);
			}			
		}

		.submit:hover
		{
			background-color: rgb(89, 211, 89);
		}

		.cancel:hover
		{
			background-color:  rgb(201, 64, 64);
		}
	}

	@media (max-width: 1000px)
	{
		.actions
		{
			flex-direction: column;
		}

		form
		{
			width: 100%;
		}
	}
`

export default Container