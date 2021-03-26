import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function confirmAlert(title: string, text: string, callback: () => {})
{
	MySwal.fire(
		{
			icon: 'question',
			title: title,
			text: text,
			showCancelButton: true,
			confirmButtonText: 'Continue'
		})
		.then(res =>
		{
			if (res.isConfirmed)
				callback()
		})
}

export default confirmAlert