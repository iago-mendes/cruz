import styled from 'styled-components'

interface ContainerProps
{
	showSecondGroup: boolean
}

const Container = styled.header<ContainerProps>`
	width: 100%;
	height: ${p => p.showSecondGroup ? '20vh' : '10vh'};
	background: #fff;

	padding: 2rem;

 .group
	{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		:first-of-type
		{
			justify-content: center;
			gap: 1rem;
		}

		h1
		{
			font-family: Ubuntu;
			font-size: 2.5rem;
		}
	 
		button
		{
			border: none;
			border-radius: 2rem;
	
			height: 5rem;
			width: 15rem;
	
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 1rem;
	
			background-color: rgb(23, 143, 12);
			cursor: pointer;
			transition: 0.5s;
			
			:hover
			{
				background-color:  rgb(32, 190, 17);
			}
		 
			span
			{
				font-family: Ubuntu;
				font-size: 1.75rem;
			}
		}
	 
	 
		.inputField
		{
			height: 4rem;
			width: 25rem;

			border: rgb(138, 138, 138) solid 1px;
			border-radius: 2rem;

			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;

			padding: 1rem;

			input
			{
				width: 100%;
				height: 100%;

				border: none;

				font-family: Roboto;
				font-size: 1.5rem;
			}
		}
	}
`

export default Container