import styled from 'styled-components'

const Container = styled.div`
	main {
		width: 100%;

		.tableContainer {
			min-height: 50vh;
			width: 100%;
			overflow-x: auto;

			padding: 2rem;

			table {
				width: fit-content;
				height: fit-content;

				border-collapse: collapse;

				thead {
					background-color: ${p => p.theme.colors.primary};
					color: ${p => p.theme.colors.secondary};

					tr {
						height: 5rem;

						th {
							font-family: Ubuntu;
							font-size: 1.25rem;

							padding: 0.5rem;
							text-overflow: ellipsis;
							min-width: 7rem;
						}

						th.name {
							width: 15rem;
						}
					}
				}

				tbody {
					tr {
						height: 5rem;

						:nth-child(odd) {
							background-color: #ccc;
						}

						:nth-child(even) {
							background-color: #fff;
						}

						td {
							font-family: Roboto;
							padding-left: 0.5rem;
							padding-right: 0.5rem;

							min-width: 7rem;

							.actions {
								display: flex;
								align-items: center;
								justify-content: space-around;

								height: 100%;
								gap: 1rem;

								button {
									padding: 0.5rem;
									border-radius: 100rem;
									font-size: 1.5rem;

									display: flex;
									align-items: center;
									justify-content: center;

									border: none;
									background: none;

									cursor: pointer;
									transition: 0.25s;

									:hover {
										background-color: ${p => p.theme.colors.secondary};
									}
								}

								button.delete:hover {
									background-color: rgb(201, 64, 64);
								}
							}
						}

						td.img {
							height: 5rem;

							display: flex;
							align-items: center;
							justify-content: center;

							img {
								max-width: 4.5rem;
								max-height: 4.5rem;
							}
						}
					}

					.blocked {
						opacity: 0.5;
					}
				}
			}

			th,
			td {
				border: 1px solid rgba(0, 0, 0, 0.25);
			}
		}

		.productsActions {
			width: 100%;
			padding: 1rem 2rem;

			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 2rem;

			button {
				display: flex;
				align-items: center;
				gap: 1rem;

				background: ${p => p.theme.colors.primary};
				border: none;
				border-radius: 1rem;

				padding: 0.5rem 1rem;
				color: #fff;
				font-size: 1.5rem;

				transition: 0.25s;

				:hover {
					border-radius: 0;
					filter: brightness(0.9);
				}
			}

			.filter {
				display: flex;
				align-items: center;
				gap: 0.5rem;

				span {
					font-size: 1.5rem;
				}

				.select {
					width: 18rem;
				}
			}
		}
	}

	@media (max-width: 1000px) {
		main .productsActions {
			flex-direction: column;
			align-items: flex-end;
		}
	}
`

export default Container
