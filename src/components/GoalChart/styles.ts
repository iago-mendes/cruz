import styled from 'styled-components'

const Container = styled.div`
	background: #fff;
	border-radius: 0.5rem;
	width: 100%;

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		padding: 0.5rem 1rem;
		border-bottom: rgba(0, 0, 0, 0.25) 2px solid;

		.controller {
			display: flex;
			align-items: center;
			gap: 0.5rem;

			button {
				display: flex;
				align-items: center;
				justify-content: center;

				font-size: 1.5rem;
				background: none;
				border: none;
				border-radius: 100rem;
				padding: 0.5rem;

				transition: background 0.25s;

				:hover {
					background: rgba(0, 0, 0, 0.25);
				}
			}

			span {
				font-size: 1.5rem;
			}
		}
	}

	.content {
		.chart {
			background: ${p => p.theme.colors.background}40;
			padding: 1rem;

			display: flex;
			align-items: center;
			justify-content: center;
		}

		.summary {
			border-top: rgba(0, 0, 0, 0.25) 2px solid;
			padding: 1rem 2rem;

			display: flex;
			flex-direction: column;
			gap: 1rem;

			width: 100%;

			.info {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;

				.name {
					font-size: 1.25rem;
					font-weight: 700;
					color: ${p => p.theme.colors.text}bf;
				}

				.value {
					font-size: 1.75rem;
					font-weight: 700;
				}

				.obs {
					color: ${p => p.theme.colors.text}bf;
				}
			}
		}
	}

	.notFound {
		height: 30rem;
		padding: 1rem;

		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 1rem;

		p {
			font-size: 2rem;
		}
	}

	#custom-tooltip {
		background: #fff;
		box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
		padding: 1rem;

		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		font-size: 1.25rem;

		.month {
			color: ${p => p.theme.colors.primary};
		}

		.day {
			color: ${p => p.theme.colors.secondary};
		}
	}

	button.action {
		background: none;
		border: ${p => p.theme.colors.primaryDark} 2px solid;
		border-radius: 0.5rem;
		padding: 0.25rem 1rem;

		font-size: 1.5rem;
		font-weight: 700;
		color: ${p => p.theme.colors.primaryDark};

		display: flex;
		align-items: center;
		width: fit-content;

		transition: color 0.2s, background-color 0.2s;

		:hover {
			background-color: ${p => p.theme.colors.primaryDark};
			color: #fff;
		}
	}

	.actions {
		width: 100%;

		display: flex;
		justify-content: flex-end;
		gap: 1rem;
	}

	@media (min-width: 1001px) {
		.content {
			display: flex;

			.summary {
				border-top: none;
				border-left: rgba(0, 0, 0, 0.25) 2px solid;

				.info {
					.name {
						font-size: 1.5rem;
					}

					.value {
						font-size: 2rem;
					}

					.obs {
						font-size: 1.25rem;
					}
				}
			}
		}
	}
`

export default Container
