import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function warningAlert(title: string, text?: string) {
	MySwal.fire({
		icon: 'warning',
		title,
		text
	})
}

export default warningAlert
