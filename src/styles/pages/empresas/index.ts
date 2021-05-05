import styled from 'styled-components'

const Container = styled.div`
	overflow-y: auto;

	main
	{
		width: 100%;
		height: fit-content;
		padding: 2rem;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		
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
				justify-content: center;
	
				.name
				{
					font-family: Ubuntu;
					font-weight: 700;
					font-size: 2.5rem;

					text-decoration: underline;
	
					color: ${p => p.theme.colors.primaryDark};
					transition: 0.25s;
	
					:hover
					{
						color: ${p => p.theme.colors.primaryLight};
					}
				}
	
				.description
				{
					font-weight: 700;
					font-size: 1.5rem;
				}
			}

			.actions
			{
				display: flex;
				gap: 1rem;

				button
				{
					width: 5rem;
					height: 5rem;
					border-radius: 2.5rem;

					display: flex;
					align-items: center;
					justify-content: center;
		
					border: none;
					background: none;
					font-size: 2.5rem;
		
					transition: background-color 0.25s;
				}

				.delete:hover
				{
					background-color: ${p => p.theme.colors.buttonRed};
				}
	
				.edit:hover
				{
					background-color: ${p => p.theme.colors.secondary};
				}
			}
		}
	}

	@media (max-width: 1000px)
	{
		main .company
		{
			width: 100%;
			height: fit-content;
			flex-direction: column;

			img
			{
				max-height: 7.5rem;
				max-width: 100%;
			}

			.actions
			{
				margin-right: auto;

				button
				{
					font-size: 2rem;

					width: 4rem;
					height: 4rem;
				}
			}
		}
	}
`

export default Container