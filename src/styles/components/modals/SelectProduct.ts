import styled from 'styled-components'

const Container = styled.main`
	padding: 1rem;
	padding-bottom: 5rem;
	height: calc(80vh - 4rem);

	display: flex;
	flex-direction: column;
	justify-content: space-between;

	.group
	{
		display: flex;
		align-items: center;
		justify-content: space-around;

		.img
		{
			width: 15rem;
			height: 15rem;

			display: flex;
			justify-content: center;

			img
			{
				max-width: 100%;
				max-height: 100%;
			}
		}

		.select
		{
			width: calc(100% - 15rem - 1rem);
		}

		.subGroup
		{
			display: flex;
			flex-direction: column;
			gap: 1rem;

			font-family: Roboto;

			label
			{
				font-size: 2rem;
				font-weight: 700;

				color: ${p => p.theme.colors.primaryDark};
				padding-left: 1rem;
				border-left: ${p => p.theme.colors.primaryDark} 5px solid;
			}

			span, input
			{
				font-size: 1.75rem;
				margin-left: 2rem;
				color: ${p => p.theme.colors.text};
			}

			input
			{
				border: none;
				border-bottom: ${p => `${p.theme.colors.text}80`} 2px solid;

				height: 3rem;
				width: 15rem;
				border-radius: 0.25rem;

				padding-left: 1rem;
				padding-right: 1rem;
				transition: 0.25s;

				:focus, :hover
				{
					border-bottom-color: ${p => p.theme.colors.primary};
				}
			}
		}

		button.confirm
		{
			font-family: Ubuntu;
			font-size: 1.75rem;
			font-weight: 700;
			background-color: #fff;

			color: ${p => p.theme.colors.text};

			display: flex;
			align-items: center;
			gap: 1rem;

			padding: 1rem 2rem;
			
			border: none;
			border-radius: 2rem;
			
			cursor: pointer;
			transition: 0.25s;

			:hover
			{
				transform: scale(1.1);
				border-radius: 0;
				background-color: ${p => p.theme.colors.buttonGreen};
			}
		}
	}

	@media (max-width: 1000px)
	{
		gap: 2rem;

		.group
		{
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;

			.select
			{
				width: 100%;
			}
		}
	}
`

export default Container