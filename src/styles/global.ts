import {createGlobalStyle} from 'styled-components'
import {Styles} from 'react-select'

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

export const selectStyles: Styles =
{
	option: (provided, state) => (
	{
		...provided,
		cursor: 'pointer',

		fontFamily: 'Roboto',
		fontSize: '1.5rem',

		transition: '0.1s',
		color: state.isSelected ? '#E2DADB' : state.isFocused ? '#313131' : '#7B7B7B',
		backgroundColor: state.isSelected ? '#84130B' : '#E2DADB'
	}),

	menu: (provided, state) => (
	{
		...provided,
		fontFamily: 'Roboto',
		backgroundColor: '#E2DADB'
	}),

	control: (provided, state) => (
	{
		...provided,

		cursor: 'pointer',
		borderWidth: '2px',
		
		transition: '0.25s',

		fontFamily: 'Roboto',
		fontSize: '1.5rem',

		width: '100%'
	})
}