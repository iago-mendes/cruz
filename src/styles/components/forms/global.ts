import styled from 'styled-components'

const Container = styled.form`
	background-color: #fff;
	width: 90%;
	max-width: 1100px;
	border-radius: 2rem;
	padding: 2rem;

	display: flex;
	align-items: flex-start;
	justify-content: center;
	flex-direction: column;
	gap: 3rem;

	.field
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
			border: none;
			border-bottom: ${p => `${p.theme.colors.text}40`} 2px solid;
			height: 2.5rem;

			font-size: 1.75rem;
			color: ${p => p.theme.colors.text};

			padding: 0 1rem;
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
				gap: 2rem;
				
				width: 100%;

				input
				{
					width: 40%;
				}

				.select
				{
					width: 40%;
				}

				.group
				{
					display: flex;
					align-items: center;
					gap: 5rem;

					.whatsapp
					{
						color: green;

						display: flex;
						align-items: center;
						gap: 1rem;
					}
				}

				button:hover
				{
					background-color: rgb(201, 64, 64);
				}

				.comissao
				{
					width: fit-content;

					display: flex;
					align-items: center;

					span
					{
						font-size: 1.75rem;
						color: ${p => p.theme.colors.text};
					}

					input
					{
						width: 10rem;
					}
				}
			}

			button
			{
				display: flex;
				align-items: center;
				font-size:1.5rem;
				gap: 1rem;
				
				padding: 0.5rem 1rem;
				border-radius: 2rem;
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

				span
				{
					white-space: nowrap;
				}
			}
		}

		.addressField
		{
			padding-left: 2rem;

			display: flex;
			flex-direction: column;	
		}

		.switchFields
		{
			display: flex;
			align-items: center;
			justify-content: space-around;

			.switchField
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
			resize: vertical;
			
			border: ${p => p.theme.colors.text}40 2px solid;
			border-radius: 1rem;
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

	button.modal
	{
		width: fit-content;
		padding: 0.5rem 1rem;

		background: none;
		border: ${p => p.theme.colors.primaryDark} 2px solid;
		border-radius: 2rem;

		color: ${p => p.theme.colors.primaryDark};
		font-family: Ubuntu;
		font-size: 1.75rem;

		transition: 0.25s;
		
		:hover
		{
			background-color: ${p => p.theme.colors.primaryDark};
			color: #fff;

			border-radius: 0;
		}
	}
`

export default Container