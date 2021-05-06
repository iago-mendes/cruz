import styled from 'styled-components'

const Container = styled.div`
	width: 100vw;
	height: 100vh;
	background-color: ${p => p.theme.colors.primary};

	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 5rem;

	.logo
	{
		width: 40%;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
		img
		{
			width: 40rem;
		}
	
		h1
		{
			font-family: Ubuntu;
			color: ${p => p.theme.colors.secondary};
			font-size: 3rem;
		}
	}

	form
	{
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 2rem;

		padding: 5rem;
		padding-left: 10rem;
		height: fit-content;
		width: 40%;
		
		.fieldInput
		{
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
	
			width: 100%;
			
			label
			{
				font-family: Ubuntu;
				color: ${p => p.theme.colors.secondary};
				font-size: 2rem;
				font-weight: 700;
			}
		
			input
			{
				width: 100%;
				background-color: ${p => p.theme.colors.primaryDark};
				border: none;
		
				height: 5rem;
				border-radius: 1rem;
		
				padding: 1rem;
				color: ${p => p.theme.colors.primaryLight};
				font-family: Ubuntu;
		
				transition: 0.5s;
				
				:hover, :focus
				{
					border-radius: 0;
				}
			}
		}
		
		button
		{
			width: 10rem;
			height: 4rem;
			border-radius: 1.5rem;
	
			border: none;
			background-color: ${p => p.theme.colors.primaryLight};
			
			color: ${p => p.theme.colors.primaryDark};
			font-family: Ubuntu;
			font-size: 2rem;
			font-weight: 700;
	
			display: flex;
			align-items: center;
			justify-content: center;
	
			cursor: pointer;
			transition: 0.25s;
			
			:hover
			{
				transform: scale(1.1);
				border-radius: 0;
			}
		}
	}

	@media (max-width: 1000px)
	{
		flex-direction: column;

		.logo
		{
			width: 100%;
			gap: 1rem;

			img
			{
				width: 50vw;
			}

			h1
			{
				font-size: 2rem;
			}
		}

		form
		{
			width: 100%;
			padding: 2rem;
		}
	}
`

export default Container