import styled from 'styled-components'

const Container = styled.div`
	overflow: hidden;

	.scroll
	{
		overflow: auto;
		width: 100%;
		height: 80vh;

		main
		{
			display: grid;
			grid-auto-rows: 30rem;
			grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
			grid-gap: 2rem;
			align-items: center;
			justify-items: center;

			width: 100%;
			height: fit-content;
			padding: 2rem;
			
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
				
				.buttons
				{
					width: 100%;
					height: 15%;

					display: flex;
					align-items: center;
					justify-content: space-between;

					button
					{				
						width: 3rem;
						height: 3rem;
						padding: 0.5rem;
						border-radius: 100rem;
				
						border: none;
						background: none;
				
						cursor: pointer;
						transition: 0.25s;
						
						:hover
						{
							background-color: rgb(201, 64, 64);
						}
			
						:first-of-type:hover
						{
							background-color: ${p => p.theme.colors.background};
						}
					}
				}

				.img
				{
					height: 65%;
					width: 100%;

					display: flex;
					align-items: center;
					justify-content: center;

					img
					{
						max-height: 100%;
						max-width: 80%;
					}
				}
			
				h1
				{
					height: 20%;
					
					display: flex;
					align-items: center;
					justify-content: center;

					font-family: Ubuntu;
					font-size: 2rem;
			
					color: ${p => p.theme.colors.primaryDark};
			
					cursor: pointer;
					transition: 0.25s;
					
					:hover
					{
						color: ${p => p.theme.colors.primaryLight};
					}
				}
			}
		}
	}
`

export default Container