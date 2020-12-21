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
		gap: 1rem;

		padding: 5rem;
		padding-left: 10rem;
		height: fit-content;
		width: 40%;
		
		.fieldInput
		{
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
	
			width: 100%;
			
			label
			{
				font-family: Ubuntu;
				color: ${p => p.theme.colors.secondary};
				font-size: 1.5rem;
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
					box-shadow: 5px 5px 5px black;
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
	
			display: flex;
			align-items: center;
			justify-content: center;
	
			cursor: pointer;
			transition: 0.5s;
			
			:hover
			{
				transform: scale(1.05);
				box-shadow: 5px 5px 5px black;
			}
		}
	}
`

export default Container