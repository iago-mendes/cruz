import styled from 'styled-components'

const Container = styled.main`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2rem;
	
	button
	{
		display: flex;
		align-items: center;
		gap: 1rem;

		padding: 0.5rem 1rem;

		background: none;
		border: ${p => p.theme.colors.primaryDark} 2px solid;
		border-radius: 2rem;

		color: ${p => p.theme.colors.primaryDark};
		font-family: Ubuntu;
		font-size: 2rem;

		transition: 0.25s;
		
		:hover
		{
			border-radius: 0;
		}
	}
	
	.showPwd
	{
		margin-left: 35%;
		
		:hover
		{
			background-color: ${p => p.theme.colors. primaryDark};
			color: ${p => p.theme.colors.background};
		}
	}
	
	.submit:hover
	{
		background-color: ${p => p.theme.colors.buttonGreen};
		border-color: ${p => p.theme.colors.buttonGreen};
		
		transform: scale(1.1);
	}
	
	form
	{
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		padding: 1rem;
		
		.field
		{
			display: flex;
			flex-direction: column;
			gap: 1rem;
			width: 100%;
			
			label
			{
				font-family: Ubuntu;
				font-weight: 700;
				font-size: 2rem;
				border-left: ${p => p.theme.colors.primaryDark} 5px solid;
				padding-left: 1rem;
			}
			
			input
			{
				background-color: #fff;
				border: none;
				height: 2.75rem;
				margin-left: 2rem;
				padding-left: 1rem;
				padding-right: 1rem;
				font-family: Roboto;
				font-size: 1.75rem;
				
				border-bottom: ${p => p.theme.colors.primaryDark}40 2px solid;
				transition: 0.25s;
				
				:hover, :focus
				{
					border-color: ${p => p.theme.colors.primaryDark};
				}
			}
		}
	}
	
	@media(min-width: 600px)
	{
		
		.showPwd
		{
			margin-left: 50%;
		}
		
		form .field
		{
			width: 75%;
		}
	}
`

export default Container