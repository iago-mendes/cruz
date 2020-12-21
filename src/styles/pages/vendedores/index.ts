import styled from 'styled-components'

const Container = styled.div`
	position: relative;

	main
	{
		display: grid;
		grid-auto-rows: 15rem;
		grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
		grid-gap: 2rem;
		align-items: center;
		justify-items: center;

		width: 100%;
		height: fit-content;
		min-height: 90vh;
		padding: 5rem;

		.seller
		{
			background-color: #fff;
			width: 100%;
			height: 100%;

			border-radius: 1rem;
			padding: 1rem;

			display: flex;
			align-items: center;
			justify-content: space-between;

			position: relative;

			img
			{
				width: 30%;
				height: auto;

				border-radius: 100rem;
			}

			.texts
			{
				width: 65%;

				h1
				{
					font-family: Ubuntu;
					font-size: 2.25rem;
					color: ${p => p.theme.colors.primaryDark};
				}

				h2
				{
					font-size: 1.5rem;
					font-family: Roboto;
				}

				h3
				{
					font-size: 1rem;
					font-family: Roboto;
				}
			}

			.buttons
			{
				position: absolute;
				bottom: 0.5rem;
				right: 0.5rem;

				display: flex;
				align-items: center;
				gap: 1rem;

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
		}
	}
`

export default Container