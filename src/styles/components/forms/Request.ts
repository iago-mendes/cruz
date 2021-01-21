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

			padding-left: 1rem;
			padding-right: 1rem;
			transition: 0.25s;

			:focus
			{
				border-bottom-color: ${p => p.theme.colors.primary};
			}
		}

		input[type=date]
		{
			cursor: pointer;
		}

		ul
		{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			
			padding-left: 2rem;
			gap: 0.5rem;
			
			width: 100%;

			li
			{
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				width: 100%;

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

		.toggle
		{
			display: flex;
			align-items: center;
			justify-content: space-around;

			.toggleField
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

	.products
	{
		width: 100%;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		table
		{
			margin: 1rem;
			width: calc(100% - 2rem);
			height: fit-content;

			border-collapse: collapse;

			thead
			{
				background-color: ${p => p.theme.colors.primary};
				color: ${p => p.theme.colors.secondary};

				tr
				{
					height: 5rem;

					th
					{
						font-family: Ubuntu;
						font-size: 1.25rem;

						padding-left: 0.5rem;
						padding-right: 0.5rem;
					}
				}
			}

			tbody
			{
				tr
				{
					height: 5rem;

					:nth-child(odd)
					{
						background-color: #ccc;
					}

					:nth-child(even)
					{
						background-color: #fff;
					}

					td
					{
						font-family: Roboto;
						padding-left: 0.5rem;
						padding-right: 0.5rem;

						.actions
						{
							display: flex;
							align-items: center;
							justify-content: space-around;

							height: 100%;
							gap: 0.5rem;

							button
							{				
								width: 2.5rem;
								height: 2.5rem;
								padding: 0.25rem;
								border-radius: 100rem;
						
								border: none;
								background: none;

								display: flex;
								align-items: center;
								justify-content: center;
						
								cursor: pointer;
								transition: 0.25s;
								
								:hover
								{
									background-color: ${p => p.theme.colors.delete};
								}
					
								:first-of-type:hover
								{
									background-color: ${p => p.theme.colors.secondary};
								}
							}
						}
					}

					.img
					{
						text-align: center;
						width: 5rem;
						height: 5rem;
						padding: 0.5rem;

						img
						{
							max-width: 100%;
							max-height: 100%;
						}
					}
				}
			}

			th, td
			{
				border: 1px solid rgba(0,0,0,0.25);
			}
		}

		.add
		{
			width: 2.5rem;
			height: 2.5rem;
			border-radius: 100rem;

			display: flex;
			align-items: center;
			justify-content: center;
	
			border: none;
			background: none;
			color: ${p => p.theme.colors.text};
	
			cursor: pointer;
			transition: 0.25s;
			
			:hover
			{
				background-color: ${p => p.theme.colors.confirm};
			}
		}

		.total
		{
			width: 100%;
			padding-right: 1rem;

			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 1rem;

			span
			{
				font-family: Roboto;
				color: ${p => p.theme.colors.primaryDark};
				font-weight: 700;
				font-size: 2rem;
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
				background-color: rgb(89, 211, 89);
			}

			:first-of-type:hover
			{
				background-color:  rgb(201, 64, 64);
			}
		}
	}
`

export default Container