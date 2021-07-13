import {StylesConfig} from 'react-select'

import {theme} from './theme'

export const selectStyles: StylesConfig<{label: string; value: string}, false> =
	{
		option: (provided, state) => ({
			...provided,
			cursor: 'pointer',

			fontFamily: 'Roboto',
			fontSize: '1.5rem',

			transition: '0.1s',
			color: state.isSelected
				? theme.colors.background
				: state.isFocused
				? '#313131'
				: '#7B7B7B',
			backgroundColor: state.isSelected
				? theme.colors.primary
				: theme.colors.background
		}),

		menu: provided => ({
			...provided,
			fontFamily: 'Roboto',
			backgroundColor: theme.colors.background,
			zIndex: 1
		}),

		control: provided => ({
			...provided,

			cursor: 'pointer',
			borderWidth: '2px',

			transition: '0.25s',

			fontFamily: 'Roboto',
			fontSize: '1.5rem',

			width: '100%'
		})
	}
