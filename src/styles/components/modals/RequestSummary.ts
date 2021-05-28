import styled from 'styled-components'

type ContainerProps =
{
	isExpanded: boolean
}

const Container = styled.div<ContainerProps>`
	position: fixed;
	left: 0;
	z-index: 1;

	top: ${p => p.isExpanded ? '25vh' : '90vh'};
	height: ${p => p.isExpanded ? '75vh' : '10vh'};
	transition: top 0.25s, height 0.25s;
	overflow-y: ${p => p.isExpanded ? 'auto' : 'hidden'};

	width: 100%;
	background-color: #fff;
	box-shadow: 0px -5px 10px rgba(0,0,0,0.75);
	border-top-left-radius: 1rem;
	border-top-right-radius: 1rem;

	.controller
	{
		width: 100%;
		padding: 0.5rem 0;
		
		display: flex;
		align-items: center;
		justify-content: center;

		button
		{
			background: none;
			border: none;

			display: flex;
			align-items: center;
			justify-content: center;

			font-size: 2rem;
			color: ${p => p.theme.colors.primaryDark};

			transform: ${p => p.isExpanded ? 'rotate(180deg)' : ''};
			transition: transform 0.5s;
		}
	}

	.totalPrice, .details, .products
	{
		margin-left: 1rem;
		margin-bottom: 2rem;
	}

	ul.details
	{
		display: flex;
		flex-direction: column;

		font-size: 1.5rem;
	}

	@media (min-width: 1000px)
	{
		left: 20rem;
		width: calc(100% - 20rem);
	}
`

export default Container