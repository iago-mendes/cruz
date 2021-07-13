import styled from 'styled-components'

const Container = styled.div`
	width: 75vw;
	height: 85vh;
	display: flex;
	flex-direction: column;

	header {
		display: flex;
		align-items: center;
		justify-content: flex-end;

		width: 100%;
		padding: 0.5rem;
		padding-left: 2rem;
		padding-right: 2rem;
		background-color: ${p => p.theme.colors.primary};

		.close {
			width: 3.5rem;
			height: 3.5rem;

			border-radius: 100rem;
			background: none;
			border: none;

			font-size: 2.5rem;
			color: ${p => p.theme.colors.secondary};

			display: flex;
			align-items: center;
			justify-content: center;

			cursor: pointer;
			transition: 0.25s;

			:hover {
				background-color: ${p => p.theme.colors.secondary};
				color: ${p => p.theme.colors.primary};
			}
		}
	}

	main {
		padding-top: 1rem;
		background-color: ${p => p.theme.colors.background};
		width: 100%;
		min-height: calc(85vh - (3.5rem + 1rem + 1rem));
		overflow-y: auto;
	}

	.fixed-header {
		background-color: #fff;
		border-bottom: rgba(0, 0, 0, 0.25) 2px solid;
		padding: 1rem;

		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;

		width: 100%;
		height: 5rem;
		color: ${p => p.theme.colors.primaryDark};

		button {
			width: fit-content;
			padding: 0.25rem 0.75rem;

			background: none;
			border: ${p => p.theme.colors.primaryDark} 2px solid;
			border-radius: 0.5rem;

			color: ${p => p.theme.colors.primaryDark};
			font-size: 1.5rem;
			font-family: Ubuntu;
			font-weight: 700;

			transition: 0.25s;

			:hover {
				background-color: ${p => p.theme.colors.primaryDark};
				color: #fff;

				border-radius: 0;
			}
		}
	}

	main.with-fixed-header {
		min-height: calc(85vh - (3.5rem + 1rem + 1rem + 5rem));
	}

	@media (max-width: 1000px) {
		width: 100vw;
		height: 100vh;

		top: 0;
		left: 0;
		bottom: 0;
		right: 0;

		header {
			justify-content: flex-start;
		}

		main {
			min-height: calc(100vh - (3.5rem + 1rem));
		}

		main.with-fixed-header {
			min-height: calc(100vh - (3.5rem + 1rem + 5rem));
		}
	}
`

export default Container
