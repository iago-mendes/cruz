import styled from 'styled-components'

const Container = styled.main`
	padding: 0 !important;

	.header
	{
		background-color: #fff;
		box-shadow: 0px 2.5px 10px rgba(0,0,0,0.25);
		padding: 1rem;

		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;

		width: 100%;
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

	.info
	{
		width: 100%;
		padding: 1rem;
		border-bottom: rgba(0,0,0,0.1) 2px solid;

		display: flex;
		justify-content: space-between;
		gap: 1rem;

		.img
		{
			width: 7.5rem;
			height: 7.5rem;

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
			max-width: calc(100% - 7.5rem - 1rem);
			max-height: 7.5rem;

			overflow: hidden;
			font-size: 1.25rem;
		}
	}

	.panel
	{
		width: calc(100% - 2rem);
		background-color: #fff;
		padding: 1rem;
		margin: 1rem;

		display: flex;
		justify-content: space-between;
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
			width: 50%;

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

	.field
	{
		padding: 0 2rem;
		margin-left: 1rem;
		width: calc(100% - 1rem);
		
		display: flex;
		flex-direction: column;
		gap: 1rem;

		label
		{
			font-family: Ubuntu;
			font-weight: 700;
			font-size: 2rem;

			border-left: ${p => p.theme.colors.text} 5px solid;
			padding-left: 1rem;
			margin-left: -2rem;
		}

		ul
		{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			
			padding-left: 2rem;
			gap: 1rem;
			
			width: 100%;

			li
			{
				display: flex;
				align-items: center;
				gap: 2rem;
				
				width: 100%;

				button:hover
				{
					background-color: ${p => p.theme.colors.buttonRed};
				}
			}

			button
			{
				display: flex;
				align-items: center;
				font-size:1.5rem;
				gap: 1rem;
				
				padding: 0.5rem 1rem;
				border-radius: 2rem;
				border: none;
				background-color: #fff;
				
				display: flex;
				align-items: center;
				justify-content: center;
				
				cursor: pointer;
				transition: 0.25s;
				
				:hover
				{
					background-color: ${p => p.theme.colors.buttonGreen};
				}

				span
				{
					white-space: nowrap;
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
		justify-content: flex-end;

		font-size: 1.5rem;

		span strong
		{
			color: ${p => p.theme.colors.primaryDark};
		}
	}
`

export default Container