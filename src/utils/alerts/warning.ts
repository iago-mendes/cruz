import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function warningAlert(message: string)
{
	MySwal.fire({
		icon: 'warning',
		title: message
	})
}

export default warningAlert