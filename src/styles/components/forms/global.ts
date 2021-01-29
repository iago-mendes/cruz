import styled from 'styled-components'

const Container = styled.form`
	background-color: #fff;
	width: 75%;
	max-width: 1100px;
	border-radius: 2rem;
	padding: 2rem;

	display: flex;
	align-items: flex-start;
	justify-content: center;
	flex-direction: column;

	.field
	{
		width: 80%;
		padding: 1rem;
		
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		label
		{
			font-family: Ubuntu;
			font-size: 1.5rem;
		}

		input
		{
			border: none;
			border-bottom: ${p => `${p.theme.colors.text}40`} 2px solid;
			height: 2.5rem;

			font-family: Roboto;
			font-size: 1.5rem;
			color: ${p => p.theme.colors.text};

			padding: 1rem;
			transition: 0.25s;

			:focus, :hover
			{
				border-bottom-color: ${p => p.theme.colors.primary};
			}
		}

		ul
		{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			
			padding-left: 2rem;
			gap: 1rem;
			
			width: 100%;

			li
			{
				display: flex;
				align-items: center;
				gap: 1rem;
				
				width: 100%;

				input
				{
					width: 50%;
				}

				.select
				{
					width: 40%;
				}

				button:hover
				{
					background-color: rgb(201, 64, 64);
				}
			}

			button
			{
				width: 2.5rem;
				height: 2.5rem;
				border-radius: 100%;
				
				border: none;
				background-color: ${p => p.theme.colors.background};
				
				display: flex;
				align-items: center;
				justify-content: center;
				
				cursor: pointer;
				transition: 0.25s;
				
				:hover
				{
					background-color: rgb(89, 211, 89);
				}
			}
		}

		.addressField
		{
			padding-left: 2rem;

			display: flex;
			flex-direction: column;	
		}

		.status
		{
			display: flex;
			align-items: center;
			justify-content: space-around;

			.statusField
			{
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 0.5rem;

				span
				{
					font-family: Ubuntu;
					font-size: 1.5rem;
				}
			}
		}
	}

	.textareaField
	{
		width: 100%;

		textarea
		{
			width: 100%;
			
			border: ${p => p.theme.colors.text}40 2px solid;
			border-radius: 1rem;
			padding: 0.5rem;
			
			font-size: 1.5rem;
			font-family: Roboto;

			transition: 0.25s;

			:focus, :hover
			{
				border-color: ${p => p.theme.colors.primary};
			}
		}
	}

	.buttons
	{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;

		margin-top: 5rem;
		width: 100%;

		button
		{
			width: 15rem;
			height: 5rem;
			
			font-family: Ubuntu;
			font-size: 1.75rem;
			font-weight: 700;
			background-color: ${p => p.theme.colors.background};
			
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
`

export default Container