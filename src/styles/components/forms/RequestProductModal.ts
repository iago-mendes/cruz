import styled from 'styled-components'

const Container = styled.div`
	width: 75vw;
	height: 75vh;

	background-color: ${p => p.theme.colors.background};
	border-radius: 1rem;

	header
	{
		background-color: ${p => p.theme.colors.primary};
		padding: 0.5rem;
		border-top-left-radius: 1rem;
		border-top-right-radius: 1rem;

		display: flex;
		flex-direction: column;
		align-items: flex-end;

		button
		{
			background: none;
			border: none;
			border-radius: 100rem;

			width: 3rem;
			height: 3rem;
			color: ${p => p.theme.colors.secondary};

			display: flex;
			align-items: center;
			justify-content: center;

			transition: 0.25s;
			cursor: pointer;

			:hover
			{
				background-color: ${p => p.theme.colors.secondary};
				color: ${p => p.theme.colors.primary};
			}
		}
	}

	form
	{
		padding: 1rem;
		padding-bottom: 5rem;
		height: calc(75vh - 4rem);

		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.group
		{
			display: flex;
			align-items: center;
			justify-content: space-around;
			gap: 1rem;

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
		}
	}
`

export default Container