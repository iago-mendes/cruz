import styled from 'styled-components'

type ContainerProps =
{
	isExpanded: boolean
}

const Container = styled.div<ContainerProps>`
	position: fixed;
	left: 0;
	z-index: 2;

	top: ${p => p.isExpanded ? '20vh' : '90vh'};
	height: ${p => p.isExpanded ? '80vh' : '10vh'};
	transition: top 0.25s, height 0.25s;
	overflow-y: hidden;

	width: 100%;
	background-color: #fff;
	box-shadow: 0px -5px 10px rgba(0,0,0,0.75);
	border-top-left-radius: 0.5rem;
	border-top-right-radius: 0.5rem;

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

	.totalPrice, .products
	{
		margin-left: 1rem;
		margin-right: 1rem;
		margin-bottom: 2rem;
	}

	ul
	{
		list-style: none;
	}

	ul.details
	{
		display: flex;
		flex-direction: column;

		font-size: 1.5rem;
		padding: 0 1rem;

		::after
		{
			content: '';
			display: block;
			width: 100%;
			height: 2px;

			margin-top: 1rem;
			background-color: rgba(0,0,0,0.25);
		}
	}

	ul.products
	{
		height: 70%;
		overflow-y: auto;

		li
		{
			border-bottom: rgba(0,0,0,0.25) 2px solid;
			padding: 0.5rem 1rem;

			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			
			font-size: 1.25rem;

			.detail
			{
				font-weight: 700;
			}

			.actions
			{
				display: flex;
				align-items: center;
				justify-content: flex-end;
				gap: 1rem;

				button
				{
					background: none;
					border: none;
					border-radius: 1rem;

					font-size: 1.5rem;
					width: 2rem;
					height: 2rem;

					display: flex;
					align-items: center;
					justify-content: center;

					transition: background-color 0.25s;

					:hover
					{
						background-color: rgba(0,0,0,0.25);
					}
				}
			}
		}
	}

	@media (min-width: 1000px)
	{
		left: 20rem;
		width: calc(100% - 20rem);
	}
`

export default Container