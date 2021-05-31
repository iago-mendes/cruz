import styled from 'styled-components'

export const Sidebar = styled.nav`
  background-color: ${props => props.theme.colors.primary};
  height: 100vh;
  width: 20rem;

	overflow-y: auto;

	box-shadow: 5px 0px 10px rgba(0,0,0,0.25);
	
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

export const MobileMenu = styled.nav`
  background-color: ${props => props.theme.colors.primary};
	width: 100%;
	padding: 0.5rem 1rem;

	display: flex;
	align-items: center;
	justify-content: space-between;

	position: relative;

	button.controller
	{
		font-size: 3rem;
		color: ${p => p.theme.colors.secondary};

		background: none;
		border: none;
		border-radius: 5rem;
		padding: 0.25rem;

		display: flex;
		align-items: center;
		justify-content: center;

		transition: background-color 0.25s;

		:hover
		{
			background-color: ${p => p.theme.colors.primaryDark}80;
		}
	}

	img
	{
		max-width: 5rem;
		max-height: 5rem;
	}
`

interface BurgerMenuProps
{
	isOpen: boolean
}

export const BurgerMenu = styled.div<BurgerMenuProps>`
	position: fixed;
	left: ${p => p.isOpen ? 0 : '-100vw'};
	top: 0;
	z-index: 3;

	width: 75vw;
	height: 100vh;
	background-color: ${p => p.theme.colors.primary};
	box-shadow: 5px 0px 5px rgba(0,0, 0, 0.5);

	overflow-y: auto;
	padding: 1rem;

	transition: left 0.25s;

	button.controller
	{
		margin-left: auto;
	}
`

export const OptionsList = styled.ul`
	height: 100%;
	width: 100%;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	gap: 2rem;

	list-style: none;

	padding: 2.5rem 0;

	a
	{
		color: ${p => p.theme.colors.background};
		text-decoration: none;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		width: 80%;
		padding: 0.5rem;
		border-radius: 5rem;
		cursor: pointer;

		transition: background-color 0.25s;

		:hover
		{
			background-color: ${p => p.theme.colors.primaryDark}80;
		}

		span
		{
			font-size: 1.5rem;
			margin-left: 1rem;
			transition: 0.25s;
			font-family: Ubuntu;
		}
	}

	button.sync
	{
		background: none;
		padding: 0.5rem 1rem;
		border: ${p => p.theme.colors.background} 2px solid;
		border-radius: 2rem;

		display: flex;
		align-items: center;
		gap: 1rem;

		color: ${p => p.theme.colors.background};
		font-family: Ubuntu;
		font-weight: 700;
		font-size: 1.5rem;

		transition: background-color 0.25s;

		:hover
		{
			background-color: ${p => p.theme.colors.primaryDark}80;
		}
	}
`

export const OfflineIndicatorContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;

	color: ${p => p.theme.colors.secondary};
	font-size: 2.5rem;

	svg
	{
		font-size: 5rem;
	}

	@media (max-width: 1000px)
	{
		flex-direction: row-reverse;

		font-size: 2rem;

		svg
		{
			font-size: 2.5rem;
		}
	}
`