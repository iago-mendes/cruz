import {createGlobalStyle} from 'styled-components'

export const GlobalStyle = createGlobalStyle`
	:root
	{
		font-size: 10px;
	}

	*
	{
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		outline: none;
		-webkit-tap-highlight-color: transparent;
	}

	body
	{
		background-color: ${p => p.theme.colors.background};
		color: ${p => p.theme.colors.text};
	}

	body, input, textarea, button
	{
		font-family: Roboto;
	}

	button
	{
		cursor: pointer;
	}

	a
	{
		color: inherit;
		text-decoration: none;
	}

	#__next
	{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.container
	{
		width: 100%;
		margin-left: 20rem;
	}

	.main
	{
		display: flex;
		align-items: center;
		justify-content: center;

		padding: 2rem;
		width: 100%;
	}

	.swal2-popup
	{
		#swal2-title
		{
			font-family: Ubuntu;
			font-size: 25px;
		}
		#swal2-content
		{
			font-family: Roboto;
			font-size: 20px !important;
		}
		.swal2-actions
		{
			font-size: 15px !important;
			font-family: Ubuntu !important;
		}
	}

	@media (max-width: 1000px)
	{
		#__next
		{
			flex-direction: column;
		}

		.container
		{
			width: 100%;
			
			margin-left: 0;
			margin-bottom: 15rem;
		}

		.main
		{
			padding: 1rem;
		}
	}
`
