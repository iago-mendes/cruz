import styled from 'styled-components'

const Container = styled.main`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2rem;

	padding: 1rem;

	label {
		font-family: Ubuntu;
		font-weight: 700;
		font-size: 1.75rem;

		border-left: ${p => p.theme.colors.text} 5px solid;
		padding-left: 1rem;
		margin-left: -2rem;
	}

	.target {
		width: 100%;
		padding: 0 2rem;

		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.changeGroup {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;

		align-items: center;
	}

	ul {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		padding: 0 2rem;
		gap: 1rem;

		width: 100%;
		margin-bottom: 7.5rem;

		li.table {
			display: flex;
			align-items: center;
			justify-content: space-around;
			gap: 2rem;

			width: 100%;

			.group {
				min-width: 20rem;

				display: flex;
				flex-direction: column;
				gap: 1rem;
			}
		}

		button.listButton {
			display: flex;
			align-items: center;
			font-size: 1.5rem;
			gap: 1rem;

			padding: 0.5rem 1rem;
			border-radius: 2rem;
			border: none;
			background-color: #fff;

			display: flex;
			align-items: center;
			justify-content: center;

			cursor: pointer;
			transition: 0.25s;

			span {
				white-space: nowrap;
			}
		}

		button.add:hover {
			background-color: ${p => p.theme.colors.confirm};
		}

		button.remove:hover {
			background-color: ${p => p.theme.colors.delete};
		}
	}

	@media (max-width: 1000px) {
		.changeGroup {
			grid-template-columns: 1fr;
		}

		ul li.table {
			flex-direction: column;
		}
	}
`

export default Container
