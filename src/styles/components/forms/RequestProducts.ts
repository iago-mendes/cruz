import styled from 'styled-components'

const Products = styled.div`
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
		border-radius: 100rem;
		padding: 1rem 2rem;

		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;

		border: none;
		background: none;
		color: ${p => p.theme.colors.text};

		cursor: pointer;
		transition: 0.25s;
		
		:hover
		{
			background-color: ${p => p.theme.colors.confirm};
		}

		span
		{
			font-weight: 700;
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

	@media (max-width: 1000px)
	{
		.tableContainer
		{
			width: 100%;
			overflow-x: auto;
		}
	}
`

export default Products