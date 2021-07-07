import styled from 'styled-components'

export const Container = styled.div`
	main {
		flex-direction: column;
		gap: 2rem;
	}
`

export const DropdownGroup = styled.div<{isExpanded: boolean}>`
	width: 100%;

	border-radius: 0.5rem;
	overflow: hidden;

	header {
		display: flex;
		align-items: center;
		gap: 1.5rem;

		background-color: #fff;
		padding: 1rem;

		cursor: pointer;

		h2 {
			font-size: 1.75rem;
		}

		h3 {
			font-size: 1.5rem;
		}

		.indicator {
			transition: transform 0.2s;
		}
	}

	> header .indicator {
		transform: ${p => (p.isExpanded ? 'rotate(180deg)' : 'rotate(90deg)')};
	}

	ul {
		overflow: hidden;

		background-color: rgba(255, 255, 255, 0.5);
		border-top: rgba(0, 0, 0, 0.25) 2px solid;

		li {
			border-bottom: rgba(0, 0, 0, 0.1) 2px solid;
			padding: 0.5rem 2rem;

			label {
				font-size: 1.5rem;
			}
		}
	}

	> ul li.seller {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	span {
		margin-left: auto;
		font-size: 1.5rem;
	}
`

export const GoalCompany = styled.li<{isExpanded: boolean}>`
	:first-of-type header {
		border-top: none;
	}

	> header .indicator {
		transform: ${p => (p.isExpanded ? 'rotate(180deg)' : 'rotate(90deg)')};
	}

	> ul li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}
`
