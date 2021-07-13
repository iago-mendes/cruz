import styled from 'styled-components'

export const Background = styled.div`
	background-color: ${p => p.theme.colors.primary};
	width: 100vw;
	height: 100vh;
`

export const SyncView = styled.div<{progressBar: number}>`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2rem;

	background-color: ${p => p.theme.colors.primary};
	color: #fff;
	width: 100vw;
	height: 100vh;

	header {
		margin-bottom: 5rem;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		h1 {
			font-size: 2.5rem;
		}

		svg {
			& circle {
				stroke: #fff;
				stroke-linecap: round;
				animation: dash 1.5s ease-in-out infinite;
			}
		}
	}

	#progress-bar-container {
		width: 25rem;
		height: 1rem;
		border-radius: 100rem;
		overflow: hidden;

		background-color: ${p => p.theme.colors.background};

		#progress-bar {
			height: 100%;
			width: ${p => p.progressBar}%;
			background-color: ${p => p.theme.colors.secondary};

			transition: width 0.1s;
		}
	}
`
