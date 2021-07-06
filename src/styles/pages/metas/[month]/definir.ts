import styled from 'styled-components'

export const Container = styled.div`
	form {
		margin: 2rem 1rem;

		display: flex;
		flex-direction: column;
		gap: 2rem;

		main {
			width: 100%;
			box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);

			border-radius: 0.5rem;
			overflow: hidden;
		}
	}

	@media (min-width: 1001px) {
		form {
			width: 80rem;
			margin: 2rem auto;
		}
	}
`

type GoalCompanyProps = {
	isExpanded: boolean
}

export const GoalCompany = styled.div<GoalCompanyProps>`
	:first-of-type header {
		border-top: none;
	}

	header {
		display: flex;
		align-items: center;
		gap: 1.5rem;

		background-color: #fff;
		padding: 1rem;
		border-top: rgba(0, 0, 0, 0.4) 2px solid;

		cursor: pointer;

		.indicator {
			transform: ${p => (p.isExpanded ? 'rotate(180deg)' : 'rotate(90deg)')};
			transition: transform 0.2s;
		}

		h2 {
			font-size: 1.75rem;
		}

		span {
			margin-left: auto;
			font-size: 1.5rem;
		}
	}

	ul {
		overflow: hidden;

		background-color: rgba(255, 255, 255, 0.5);
		border-top: rgba(0, 0, 0, 0.25) 2px solid;

		li {
			border-bottom: rgba(0, 0, 0, 0.1) 2px solid;
			padding: 0.5rem 1rem;

			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 0.5rem;

			label {
				font-size: 1.5rem;
			}
		}
	}
`
