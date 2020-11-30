import styled from 'styled-components'

const Container = styled.div`
	main
	{
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		
		.line
		{
			align-self: center;
			justify-self: center;
	
			width: 75%;
			height: 30rem;
	
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;
	
			background: #fff;
			border-radius: 2rem;
			padding: 1rem;
	
			position: relative;
			
			img
			{
				width: 20rem;
			}
		
			h1
			{
				font-family: Ubuntu;
				font-size: 2.5rem;
		
				color: var(--primary-dark);
		
				cursor: pointer;
				transition: 0.5s;
				
				:hover
				{
					color: var(--primary-light)
				}
			}
			
			button
			{
				position: absolute;
				right: 1rem;
		
				width: 50px;
				height: 50px;
				border-radius: 100px;
		
				border: none;
				background: none;
		
				cursor: pointer;
				transition: 0.5s;
				
				:hover
				{
					background-color: var(--background);
				}
			}
		}
	}
`

export default Container