import styled from 'styled-components'

const Container = styled.div`
	width: 75vw;
	height: 85vh;
	display: flex;
	flex-direction: column;
	
	header
	{
		display: flex;
		align-items: center;
		justify-content: flex-end;
		width: 100%;
		padding: 0.5rem;
		padding-left: 2rem;
		padding-right: 2rem;
		background-color: ${p => p.theme.colors.primary};
		
		.close
		{
			width: 3.5rem;
			height: 3.5rem;
			border-radius: 100rem;
			background: none;
			border: none;
			color: ${p => p.theme.colors.secondary};
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition: 0.25s;
			
			:hover
			{
				background-color: ${p => p.theme.colors.secondary};
				color: ${p => p.theme.colors.primary};
				transform: scale(1.1);
			}
		}
	}
	
	main
	{
		padding-top: 1rem;
		background-color: ${p => p.theme.colors.background};
		width: 100%;
		min-height: calc(85vh - (3.5rem + 1rem + 1rem));
		overflow-y: auto;
	}
	
	@media(max-width: 1000px)
	{
		width: 100vw;
		height: 100vh;

		top: 0;
		left: 0;
		bottom: 0;
		right: 0;

		main
		{
			min-height: calc(100vh - (3.5rem + 1rem + 1rem));
		}
	}
`

export default Container