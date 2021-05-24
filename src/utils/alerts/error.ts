import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function errorAlert(text?: string, title?: string)
{
	MySwal.fire({
		icon: 'error',
		title: title ? title : 'Algo errado aconteceu!',
		text
	})
}

export default errorAlert