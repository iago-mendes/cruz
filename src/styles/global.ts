import {createGlobalStyle} from 'styled-components'

export default createGlobalStyle`
	:root
	{
		font-size: 10px;
	}

	*
	{
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		outline: none;
	}

	body
	{
		background-color: ${p => p.theme.colors.background};
	}

	#__next
	{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.container
	{
		height: 100vh;
		width: 100%;
		overflow-y: auto;
	}

	.main
	{
		display: flex;
		align-items: center;
		justify-content: center;

		padding: 2rem;
	}
`