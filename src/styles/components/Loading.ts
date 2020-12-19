import styled from 'styled-components'

const Container = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	
	svg
	{
		animation: rotate 2s linear infinite;
		
		width: 50px;
		height: 50px;
		& circle {
			stroke: ${p => p.theme.colors.primary};
			stroke-linecap: round;
			animation: dash 1.5s ease-in-out infinite;
		}
		
		@keyframes rotate
		{
			100% {
				transform: rotate(360deg);
			}
		}
		@keyframes dash
		{
			0% {
				stroke-dasharray: 1, 150;
				stroke-dashoffset: 0;
			}
			50% {
				stroke-dasharray: 90, 150;
				stroke-dashoffset: -35;
			}
			100% {
				stroke-dasharray: 90, 150;
				stroke-dashoffset: -124;
			}
		}
	}
`

export default Container