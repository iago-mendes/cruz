import styled from "styled-components";

const Container = styled.nav`
  background-color: ${props => props.theme.colors.primary};
  height: 100vh;
  width: 20rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	
	transition: 0.25s;

	header
	{
		height: 25%;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;

		img
		{
			width: 80%;
			transition: 0.25s;
		}
	}

	main ul, footer ul
	{
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
		gap: 2rem;
		list-style: none;
		padding-top: 5rem;
		padding-bottom: 5rem;

		a
		{
			color: ${p => p.theme.colors.background};
			text-decoration: none;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			width: 80%;
			padding: 0.5rem;
			transition: 0.25s;
			border-radius: 5rem;
			cursor: pointer;

			:hover
			{
				box-shadow: 0px 0px 10px rgba(0,0,0,0.75);
			}

			span
			{
				font-size: 1.5rem;
				margin-left: 1rem;
				transition: 0.25s;
				font-family: Ubuntu;
			}
		}
	}

	main
	{
		height: 50%;
		width: 100%;
	}
	
	footer
	{
		height: 25%;
		width: 100%;
	}
`

export default Container