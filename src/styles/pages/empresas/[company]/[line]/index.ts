import styled from 'styled-components'

const Container = styled.div`
	overflow: hidden;
	
	main
	{
		height: 80vh;
		width: 100%;
		overflow-y: auto;

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
							gap: 1rem;

							button
							{				
								width: 2rem;
								height: 2rem;
								padding: 0.25rem;
								border-radius: 100rem;
						
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
									background-color: ${p => p.theme.colors.background};
								}
							}
						}
					}


					.img
					{
						text-align: center;
						width: 5rem;
						padding: 0;

						img
						{
							max-width: 90%;
							max-height: 90%;
						}
					}
				}
			}
		}

		th, td
		{
			border: 1px solid rgba(0,0,0,0.25);
		}
	}
`

export default Container