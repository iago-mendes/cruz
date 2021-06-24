import styled from 'styled-components'

const Container = styled.header`
	width: 100%;
	height: 6.5rem;
	background: #fff;

	padding: 0 5rem;

	display: flex;
	align-items: center;
	justify-content: space-between;

	box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);

	.display {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;

		h1 {
			font-family: Ubuntu;
			font-size: 2rem;
		}
	}

	.inputField {
		height: 60%;
		width: 25rem;

		border: rgba(138, 138, 138, 0.5) solid 2.5px;
		border-radius: 2rem;

		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;

		padding: 0.5rem;

		transition: 0.25s;

		:hover {
			border-color: ${p => p.theme.colors.primary};

			svg {
				color: ${p => p.theme.colors.primary};
			}
		}

		svg {
			color: rgba(138, 138, 138, 0.5);
			transition: 0.25s;
		}

		input {
			width: 100%;
			height: 100%;

			border: none;

			font-family: Roboto;
			font-size: 1.75rem;
		}
	}

	@media (max-width: 1000px) {
		padding: 0 1rem;
		gap: 1rem;

		.inputField {
			width: 100%;
			max-width: 25rem;
		}
	}
`

type OptionsProps = {
	isExpanded: boolean
	length: number
}

export const Options = styled.div<OptionsProps>`
	position: relative;

	button.controller {
		width: 3.5rem;
		height: 3.5rem;

		font-size: 2rem;
		border-radius: 100rem;
		border: none;
		background: none;

		display: flex;
		align-items: center;
		justify-content: center;

		transition: background-color 0.25s;

		:hover {
			background-color: rgba(0, 0, 0, 0.2);
		}
	}

	ul {
		position: absolute;
		right: 0;
		top: 3.5rem;

		direction: rtl;
		overflow: hidden;

		width: ${p => (p.isExpanded ? '20rem' : 0)};
		height: ${p => (p.isExpanded ? `calc(4rem * ${p.length})` : 0)};
		opacity: ${p => (p.isExpanded ? 1 : 0)};

		background-color: #fff;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
		list-style: none;

		transition: height 0.25s, width 0.25s, opacity 0.25s;

		* {
			direction: ltr;
		}

		li {
			width: 20rem;
			height: 4rem;
			padding: 0 1rem;

			display: flex;
			align-items: center;
			justify-content: flex-start;

			cursor: pointer;
			transition: background-color 0.25s;

			:hover {
				background-color: rgba(0, 0, 0, 0.2);
			}

			span {
				font-size: 1.5rem;
			}
		}
	}
`

export default Container
