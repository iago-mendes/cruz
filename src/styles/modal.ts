import Modal from 'react-modal'

export const modalStyle: Modal.Styles = {
	overlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		zIndex: 2
	},

	content: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		background: 'none',
		border: 'none',
		padding: 0,
		width: '100%',
		height: '100%',
		left: 0,
		top: 0,
		right: 0,
		bottom: 0
	}
}
