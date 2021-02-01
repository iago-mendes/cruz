import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function errorAlert(message: string)
{
	MySwal.fire({
		icon: 'error',
		title: 'Algo deu errado',
		text: message
	})
}

export default errorAlert