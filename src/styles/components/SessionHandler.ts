import styled from 'styled-components'

export const MobileView = styled.div`
	background-color: ${p => p.theme.colors.primary};
	width: 100vw;
	height: 100vh;
	padding: 2rem;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 5rem;

	color: ${p => p.theme.colors.background};
	font-size: 2rem;
`