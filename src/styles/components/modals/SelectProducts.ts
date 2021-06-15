import styled from 'styled-components'

const Container = styled.main`
	padding: 0 !important;

	.header
	{
		background-color: #fff;
		box-shadow: 0px 2.5px 10px rgba(0,0,0,0.25);
		padding: 1rem;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		.display
		{
			width: 100%;

			display: flex;
			align-items: center;
			justify-content: space-between;

			color: ${p => p.theme.colors.primaryDark};

			button
			{
				width: fit-content;
				padding: 0.25rem 0.75rem;

				background: none;
				border: ${p => p.theme.colors.primaryDark} 2px solid;
				border-radius: 0.5rem;

				color: ${p => p.theme.colors.primaryDark};
				font-size: 1.5rem;
				font-family: Ubuntu;
				font-weight: 700;

				transition: 0.25s;
				
				:hover
				{
					background-color: ${p => p.theme.colors.primaryDark};
					color: #fff;

					border-radius: 0;
				}
			}
		}

		.search
		{
			font-size: 1.5rem;
			padding: 0.5rem 1rem;
			width: 90%;

			background-color: rgba(0,0,0,0.1);
			border-radius: 0.25rem;

			display: flex;
			align-items: center;
			gap: 1rem;
			
			input
			{
				width: 100%;

				background: none;
				border: none;
			}
		}
	}

	.products
	{
		padding: 1rem;
		margin-bottom: 5rem;

		display: grid;
		grid-auto-rows: 10rem;
		grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
		grid-gap: 1rem;
		align-items: center;
		justify-items: center;

		.product
		{
			width: 100%;
			height: 10rem;
			background-color: #fff;
			box-shadow: 0px 0px 5px rgba(0,0,0,0.25);

			display: flex;
			justify-content: space-between;

			.info
			{
				height: 100%;
				width: 70%;
				border-right: rgba(0,0,0,0.1) 2px solid;

				display: flex;
				flex-direction: column;
				justify-content: space-between;

				cursor: pointer;
				transition: background-color 0.25s;

				:hover
				{
					background-color: rgba(0,0,0,0.2);
				}

				.data
				{
					padding: 1rem;

					display: flex;
					gap: 1rem;

					.img
					{
						width: 5rem;
						height: 5rem;

						display: flex;
						align-items: center;
						justify-content: center;

						img
						{
							max-width: 100%;
							max-height: 100%;
						}
					}

					.texts
					{
						max-width: calc(100% - 5rem - 1rem);
						max-height: 5rem;

						overflow: hidden;
					}
				}

				.price
				{
					background-color: rgba(0,0,0,0.1);
					padding: 0 0.5rem;
					height: 3rem;

					display: flex;
					justify-content: flex-end;
					align-items: center;

					span
					{
						font-weight: 700;
						font-size: 1.5rem;
					}
				}
			}

			.panel
			{
				width: 30%;

				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				gap: 1rem;

				.quantity
				{
					display: flex;
					align-items: flex-end;
					gap: 1rem;

					margin-left: 1rem;

					h3
					{
						font-size: 2rem;
					}
				}

				.controller
				{
					width: 100%;

					display: flex;
					gap: 0.25rem;

					button
					{
						width: 100%;
						height: 3rem;

						border: none;
						border-radius: 0;

						font-size: 2rem;
						color: #fff;

						display: flex;
						align-items: center;
						justify-content: center;
					}

					.more
					{
						background-color: ${p => p.theme.colors.primaryDark};
					}

					.less
					{
						background-color: ${p => p.theme.colors.primary};
					}
				}
			}
		}
	}

	.summary
	{
		position: fixed;
		bottom: 0;
		left: 0;

		width: 100%;
		background-color: #fff;
		box-shadow: 0px -5px 10px rgba(0,0,0,0.5);
		padding: 1rem;

		display: flex;
		align-items: center;
		justify-content: space-between;

		font-size: 1.5rem;

		span strong
		{
			color: ${p => p.theme.colors.primaryDark};
		}
	}
`

export default Container