import styled from 'styled-components'

const Container = styled.div`
	.info
	{
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 30rem;

		padding-left: 2rem;
		
		h3
		{
			font-family: Ubuntu;
			font-size: 2rem;
			color: ${p => p.theme.colors.primaryDark};
			border-left: ${p => p.theme.colors.primaryDark} 5px solid;
			padding-left: 1rem;

			margin-left: -2rem;
		}
		
		span
		{
			font-family: Roboto;
			font-size: 1.75rem;
		}
		
		.password
		{
			background: none;
			border: ${p => p.theme.colors.primaryDark} 2px solid;
			border-radius: 0.5rem;
			width: 75%;
			padding: 0.5rem;
			font-family: Ubuntu;
			font-size: 1.75rem;
			color: ${p => p.theme.colors.primaryDark};
			cursor: pointer;
			transition: 0.25s;
			
			:hover
			{
				background-color: ${p => p.theme.colors.primaryDark};
				color: ${p => p.theme.colors.background};
				border-radius: 0;
			}
		}
	}
	
	main
	{
		display: flex;
		align-items: center;
		justify-content: space-around;

		padding: 1rem;
		margin: 1rem;
		background-color: #fff;
		border-radius: 0.5rem;
		
		.img
		{
			width: 40%;
		}
		
		.group
		{
			display: flex;
			flex-direction: column;
			gap: 1rem;
			width: 40%;
			
			.info
			{
				width: 100%;
				
				span
				{
					font-size: 2rem;
				}
			}
		}
	}
	
	.credentials
	{
		padding: 2rem;
		display: grid;
		grid-auto-rows: 7.5rem;
		grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
		grid-gap: 1rem;
		align-items: center;

		padding: 1rem;
		margin: 1rem;
		background-color: #fff;
		border-radius: 0.5rem;
	}
	
	@media(max-width: 850px)
	{
		
		main
		{
			flex-direction: column;
			gap: 2rem;
			
			.img, .group
			{
				width: 100%;
			}
		}
	}
`

export default Container