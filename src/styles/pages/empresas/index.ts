import styled from 'styled-components'

const Container = styled.div`
	main
	{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.company
	{
		width: 80%;
		height: 10rem;

		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;

		background: #fff;
		border-radius: 2rem;
		padding: 1rem;

		img
		{
			width: 10rem;
			padding: 0.5rem;
		}

		.companyText
		{
			height: 100%;
			width: 80%;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;

			h1
			{
				font-family: Ubuntu;
				font-size: 2.5rem;

				color: var(--primary-dark);

				cursor: pointer;
				transition: 0.25s;

				:hover
				{
					color: var(--primary-light)
				}
			}

			h2
			{
				font-family: Roboto;
				font-size: 1.5rem;
			}
		}

		button
		{
			width: 50px;
			height: 50px;
			border-radius: 100px;

			border: none;
			background: none;

			cursor: pointer;
			transition: 0.5s;
			
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
`

export default Container