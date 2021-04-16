import {createGlobalStyle} from 'styled-components'
import {Styles} from 'react-select'
import Modal from 'react-modal'

export default createGlobalStyle`
	:root
	{
		font-size: 10px;
	}

	*
	{
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		outline: none;
		-webkit-tap-highlight-color: transparent;
	}

	body
	{
		background-color: ${p => p.theme.colors.background};
		color: ${p => p.theme.colors.text};
	}

	body, input, textarea, button
	{
		font-family: Roboto;
	}

	button
	{
		cursor: pointer;
	}

	a
	{
		color: inherit;
		text-decoration: none;
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
		width: calc(100% - 20rem);
		overflow-y: auto;
	}

	.main
	{
		display: flex;
		align-items: center;
		justify-content: center;

		padding: 2rem;
		width: 100%;
	}

	.swal2-popup
	{
		#swal2-title
		{
			font-family: Ubuntu;
			font-size: 25px;
		}
		#swal2-content
		{
			font-family: Roboto;
			font-size: 20px !important;
		}
		.swal2-actions
		{
			font-size: 15px !important;
			font-family: Ubuntu !important;
		}
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

export const modalStyle: Modal.Styles =
{
	overlay:
	{
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		zIndex: 2
	},

	content:
	{
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		background: 'none',
		border: 'none',
		padding: 0,
		width: '100%',
		height: '100%',
		left: 0,
		top: 0
	}
}