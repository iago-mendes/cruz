import styled from 'styled-components'

const Container = styled.div`
	main
	{
		height: 90vh;
		width: 100%;

		overflow: auto;

		table
		{
			width: fit-content;
			height: fit-content;
			margin: 2rem;

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

						padding: 0.5rem;
						text-overflow: ellipsis;
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

						min-width: 7rem;

						.actions
						{
							display: flex;
							align-items: center;
							justify-content: space-around;

							height: 100%;
							gap: 1rem;

							button
							{				
								padding: 0.5rem;
								border-radius: 100rem;
								font-size: 1.5rem;

								display: flex;
								align-items: center;
								justify-content: center;
						
								border: none;
								background: none;
						
								cursor: pointer;
								transition: 0.25s;
								
								:hover
								{
									background-color: rgb(201, 64, 64);
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
						width: 5rem;
						height: 5rem;
						padding: 0.25rem;

						display: flex;
						align-items: center;
						justify-content: center;

						img
						{
							max-width: 100%;
							max-height: 100%;
						}
					}
				}
			}
		}

		th, td
		{
			border: 1px solid rgba(0,0,0,0.25);
		}

		.productsActions
		{
			width: 100%;
			padding: 1rem 2rem;

			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 2rem;

			button
			{
				display: flex;
				align-items: center;
				gap: 1rem;

				background: ${p => p.theme.colors.primary};
				border: none;
				border-radius: 1rem;

				padding: 0.5rem 1rem;
				color: #fff;
				font-size: 1.5rem;

				transition: 0.25s;

				:hover
				{
					border-radius: 0;
					filter: brightness(0.9);
				}
			}
		}
	}
`

export default Container