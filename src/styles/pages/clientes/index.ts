import styled from 'styled-components'

const Container = styled.div`
	main
	{
		flex-direction: column;
		gap: 1rem;

		.client
		{
			background-color: #fff;
			width: 90%;
			height: 7.5rem;

			border-radius: 1rem;
			padding: 0.5rem;

			display: flex;
			align-items: center;
			justify-content: space-between;

			.imgNames
			{
				display: flex;
				align-items: center;
				justify-content: flex-start;
				gap: 2rem;

				height: 100%;
				width: 50%;

				img
				{
					max-height: 100%;
					border-radius: 0.5rem;
				}

				.names
				{

					h1
					{
						font-family: Ubuntu;
						font-size: 1.75rem;
						
						color: ${p => p.theme.colors.primary};
					}

					h2
					{
						font-family: Roboto;
						font-size: 1.5rem;
					}
				}
			}

			.statusActions
			{
				display: flex;
				align-items: center;
				justify-content: flex-end;
				gap: 2rem;

				height: 100%;
				width: 50%;
			
				.status
				{
					display: flex;
					gap: 2rem;

					span
					{
						padding: 0.5rem 1rem;

						color: #fff;
						font-family: Ubuntu;
						font-size: 1.5rem;

						border-radius: 1rem;
					}
				}

				.buttons
				{
					display: flex;
					gap: 1rem;

					button
					{
						width: 5rem;
						height: 5rem;
						border-radius: 10rem;
			
						border: none;
						background: none;
						font-size: 2.5rem;

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
		}
	}

	@media (max-width: 1000px)
	{
		main .client
		{
			height: fit-content;
			flex-direction: column;
			gap: 1rem;

			width: 100%;

			.imgNames
			{
				width: 100%;

				img
				{
					max-height: 5rem;
				}

				.names
				{
					h1
					{
						font-size: 1.5rem;
					}

					h2
					{
						font-size: 1.25rem;
					}
				}
			}

			.statusActions
			{
				width: 100%;
				flex-direction: column;
				gap: 1rem;

				.status span
				{
					font-size: 1.25rem;
				}

				.buttons
				{
					margin-right: auto;

					button
					{
						width: 4rem;
						height: 4rem;

						font-size: 2rem;
					}
				}
			}
		}
	}
`

export default Container