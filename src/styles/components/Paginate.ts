import styled from 'styled-components'

const Container = styled.div`
	min-height: 90vh;
	
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	
	.paginate
	{
		width: 100%;
		padding: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 3rem;
		
		.buttons
		{
			display: flex;
			gap: 1rem;
			
			button
			{
				background: none;
				border: none;
				padding: 0.5rem;
				color: ${p => p.theme.colors.primary};
				border-radius: 100rem;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				transition: 0.25s;
				
				:hover
				{
					color: ${p => p.theme.colors.background};
					background-color: ${p => p.theme.colors.primary};
				}
			}
		}
		
		.controller
		{
			input
			{
				background: none;
				border: none;
				border-bottom: ${p => p.theme.colors.primary}40 2px solid;
				font-family: Roboto;
				font-size: 1.5rem;
				color: ${p => p.theme.colors.primary};
				padding-left: 0.5rem;
				padding-right: 0.5rem;
				width: 5rem;
				transition: 0.25s;
				
				:focus, :hover
				{
					border-bottom-color: ${p => p.theme.colors.primary};
				}
				
				::-webkit-outer-spin-button, ::-webkit-inner-spin-button
				{
					-webkit-appearance: none;
					margin: 0;
				}
				
				[type=number]
				{
					-moz-appearance: textfield;
				}
			}
			
			span
			{
				font-family: Roboto;
				font-size: 1.5rem;
				color: ${p => p.theme.colors.primary};
			}
		}
	}
	
	.noResults
	{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: calc(100vh - 5rem - 30rem - 10rem);
		
		h1
		{
			font-family: Ubuntu;
			font-size: 2.5rem;
			color: ${p => p.theme.colors.primary};
		}
	}
`

export default Container