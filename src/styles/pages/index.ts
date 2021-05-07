import styled from 'styled-components'

interface ContainerProps
{
	isAdmin: boolean
}

const Container = styled.div<ContainerProps>`
	main
	{
		flex-direction: column;
		gap: 2rem;

		.request
		{
			width: 75%;
			background-color: #fff;
			border-radius: 2rem;

			.header
			{
				height: 5rem;
				width: 100%;

				display: flex;
				align-items: center;
				justify-content: space-between;

				padding-left: 2rem;
				padding-right: 2rem;

				.typeDate
				{
					display: flex;
					align-items: center;
					gap: 1rem;

					span
					{
						display: flex;
						align-items: center;
						justify-content: center;
						
						padding: 0.5rem;
						padding-left: 1rem;
						padding-right: 1rem;

						border-radius: 1rem;

						font-family: Ubuntu;
						color: #fff;
						font-size: 1.5rem;
					}

					h2
					{
						font-family: Roboto;
						color: ${p => p.theme.colors.text};
					}
				}

				.status
				{
					display: flex;
					align-items: center;
					gap: 1rem;

					span
					{
						display: flex;
						align-items: center;
						justify-content: center;
						
						padding: 0.5rem;
						padding-left: 1rem;
						padding-right: 1rem;

						border-radius: 1rem;

						font-family: Ubuntu;
						color: #fff;
						font-size: 1.25rem;
					}
				}

				.buttons
				{
					display: flex;
					gap: 1rem;

					a, button
					{
						width: 4rem;
						height: 4rem;
						font-size: 2rem;
						border-radius: 10rem;
			
						border: none;
						background: none;

						display: flex;
						align-items: center;
						justify-content: center;
			
						cursor: pointer;
						transition: 0.25s;
			
						:hover
						{
							background-color: ${p => p.theme.colors.secondary};
						}
					}

					.delete:hover
					{
						background-color: ${p => p.theme.colors.buttonRed};
					}
				}
			}

			ul
			{
				background-color: ${p => `${p.theme.colors.background}80`};
				border-bottom-left-radius: 2rem;
				border-bottom-right-radius: 2rem;

				padding: 2rem;

				li
				{
					list-style: none;
					border-top: ${p => `${p.theme.colors.text}40`} 1px solid;

					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 1rem;

					padding: 0.5rem;
					height: 6rem;

					:first-of-type
					{
						border: none;
					}

					.imgName
					{
						display: flex;
						align-items: center;
						gap: 1rem;

						img
						{
							max-width: 5rem;
							max-height: 5rem;

							border-radius: 0.5rem;
						}

						h1
						{
							font-family: Roboto;
							color: ${p => p.theme.colors.text};
							font-size: 2rem;
						}
					}

					.description
					{
						h2
						{
							font-family: Roboto;
							color: ${p => p.theme.colors.text};
							font-size: 1.5rem;
						}
					}
				}
			}
		}
	}

	@media (max-width: 1000px)
	{
		main .request
		{
			width: 100%;

			.header
			{
				height: fit-content;
				flex-direction: column;
				align-items: flex-start;

				padding: 1rem;
				gap: 1rem;

				.status span
				{
					font-size: 1rem;
				}

				.buttons a, .buttons button
				{
					width: 3rem;
					height: 3rem;
					font-size: 1.75rem;
				}
			}

			ul li
			{
				height: fit-content;
				flex-direction: column;
				align-items: flex-start;

				.imgName
				{
					img
					{
						max-width: 4rem;
						max-height: 4rem;
					}

					h1
					{
						font-size: 1.75rem;
					}
				}

				.description h2
				{
					font-size: 1.25rem;
				}
			}
		}
	}
`

export default Container