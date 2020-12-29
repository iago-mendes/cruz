import styled from 'styled-components'

const Container = styled.div`
	main
	{
		flex-direction: column;
		gap: 1rem;

		.client
		{
			background-color: #fff;
			width: 75%;
			height: 15rem;

			border-radius: 2rem;
			padding: 1rem;

			display: flex;
			align-items: center;
			justify-content: space-between;

			.left
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
					border-radius: 1rem;
				}

				.names
				{

					h1
					{
						font-family: Ubuntu;
						font-size: 2.5rem;
					}

					h2
					{
						font-family: Roboto;
						font-size: 1.5rem;
					}
				}
			}

			.right
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
						padding: 1rem;
						padding-left: 1.5rem;
						padding-right: 1.5rem;

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

		}
	}
`

export default Container