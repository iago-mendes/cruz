import styled from 'styled-components'

const Container = styled.form`
	background-color: #fff;
	width: 75%;
	max-width: 1100px;
	border-radius: 2rem;
	padding: 2rem;

	display: flex;
	align-items: flex-start;
	justify-content: center;
	flex-direction: column;

	div
	{
		width: 100%;
		padding: 1rem;
		
		display: flex;
		flex-direction: column;

		label
		{
			font-family: Roboto;
			font-size: 1.5rem;
			
			margin-bottom: 0.5rem;
		}

		input
		{
			width: 100%;
			
			border: rgb(134, 134, 134) solid 1px;
			border-radius: 1rem;
			padding: 0.5rem;
			
			font-family: Roboto;
		}

		input[type=file]
		{
			border: none;
			border-radius:0;
			padding: 0;
			
			width: fit-content;
			cursor: pointer;
		}

		ul
		{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			
			padding-left: 2rem;
			gap: 0.5rem;
			
			width: 60%;

			li
			{
				display: flex;
				align-items: center;
				gap: 1rem;
				
				width: 100%;

				input
				{
					width: 100%;
				}

				button:hover
				{
					background-color: rgb(201, 64, 64);
				}
			}
		}

		button
		{
			width: 2.5rem;
			height: 2.5rem;
			border-radius: 100%;
			
			border: none;
			background-color: var(--background);
			
			display: flex;
			align-items: center;
			justify-content: center;
			
			cursor: pointer;
			transition: 0.5s;
			
			:hover
			{
				background-color: rgb(89, 211, 89);
			}
		}
	}

	.buttons
	{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;

		button
		{
			width: 15rem;
			height: 5rem;
			
			font-family: Ubuntu;
			font-size: 1.75rem;
			background-color: var(--background);
			
			border: none;
			border-radius: 2rem;
			
			cursor: pointer;
			transition: 0.5s;
			
			:hover
			{
				background-color: rgb(89, 211, 89);
			}

			:first-of-type:hover
			{
				background-color:  rgb(201, 64, 64);
			}
		}
	}
`

export default Container