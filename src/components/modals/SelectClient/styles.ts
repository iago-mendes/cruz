import styled from 'styled-components'

const Container = styled.main`
	.search {
		background-color: #fff;
		width: fit-content;

		margin-left: 5rem;
		padding: 0.5rem 1rem;

		display: flex;
		align-items: center;
		gap: 1rem;

		font-size: 2rem;

		input {
			border: none;
			background: none;

			font-size: 1.75rem;
		}

		.clear {
			display: flex;
			align-items: center;
			justify-content: center;

			background: none;
			border: none;

			font-size: 2rem;
		}
	}

	.results {
		width: 100%;

		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
		grid-auto-rows: 10rem;
		grid-gap: 1rem;
		align-items: center;
		justify-items: center;

		.client {
			display: flex;
			align-items: center;
			justify-content: space-between;

			width: 30rem;
			height: 10rem;

			background-color: #fff;
			padding: 0.5rem;

			cursor: pointer;
			transition: 0.25s;

			:hover {
				background-color: ${p => p.theme.colors.primary}40;
			}

			.img {
				width: 20%;
				height: 100%;

				display: flex;
				align-items: center;
				justify-content: center;

				img {
					max-width: 100%;
					max-height: 100%;
				}
			}

			.info {
				width: 75%;

				display: flex;
				flex-direction: column;
				gap: 0.25rem;

				span {
					font-size: 1.25rem;
				}

				.highlight {
					color: ${p => p.theme.colors.primary};
					font-weight: 700;
				}
			}
		}
	}

	@media (max-width: 1000px) {
		.search {
			margin-left: auto;
			margin-right: auto;

			font-size: 1.5rem;

			input {
				font-size: 1.5rem;
			}

			.clear {
				font-size: 1.5rem;
			}
		}
	}
`

export default Container
