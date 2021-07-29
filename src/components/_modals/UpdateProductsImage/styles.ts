import styled from 'styled-components'

export const Container = styled.main`
	padding-bottom: 5rem;

	h1 {
		width: fit-content;
		margin: 0 auto;
	}

	.content {
		margin: 2rem auto;
		margin-bottom: 20rem;
		padding: 0 2rem;
		max-width: 75rem;

		display: flex;
		flex-direction: column;
		gap: 2rem;

		.dropzone {
			width: 100%;
			height: 20rem;

			display: flex;
			align-items: center;
			justify-content: center;

			background-color: #fff;
			border-radius: 1rem;
			outline: 0;

			cursor: pointer;
			transition: 0.25s;

			:hover {
				transform: scale(1.01);
			}

			p {
				width: calc(100% - 6rem);
				height: calc(100% - 6rem);

				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 0.25rem;

				border: ${p => p.theme.colors.primary} 1px dashed;
				border-radius: 1rem;

				color: ${p => p.theme.colors.primary};
				font-family: Ubuntu;
				font-size: 1.5rem;
				font-weight: bold;

				text-align: center;
				padding: 1rem;

				svg {
					width: 2.5rem;
					height: 2.5rem;
					color: ${p => p.theme.colors.primary};
				}
			}
		}

		ul.images {
			display: flex;
			flex-direction: column;
			gap: 1rem;

			li {
				list-style: none;

				display: flex;
				flex-direction: column;
				gap: 1rem;

				padding: 0.5rem;
				border-radius: 0.5rem;
				transition: background-color 0.2s;

				:hover {
					background-color: rgba(0, 0, 0, 0.1);
				}

				.imageContainer {
					display: flex;
					align-items: center;
					gap: 1rem;

					button {
						background: none;
						border: none;

						width: 3rem;
						height: 3rem;
						font-size: 2rem;
						border-radius: 50%;

						display: flex;
						align-items: center;
						justify-content: center;

						transition: background-color 0.2s;

						:hover {
							background-color: ${p => p.theme.colors.buttonRed};
						}
					}

					figure {
						width: 10rem;
						height: 10rem;

						display: flex;
						align-items: center;
						justify-content: center;

						img {
							max-width: 100%;
							max-height: 100%;

							border-radius: 0.5rem;
						}
					}
				}

				.select {
					width: 25rem;
					margin-left: auto;
				}
			}
		}
	}

	@media (min-width: 700px) {
		.content ul.images li {
			flex-direction: row;
			align-items: center;
		}
	}
`
