import {useRef, useEffect} from 'react'

const useClickOutside = (action: () => void) =>
{
	const ref = useRef(null)

	useEffect(() =>
	{
		document.addEventListener('mousedown', handleClickOutside)
		
		return () =>
		{
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [ref])

	function handleClickOutside(e: MouseEvent)
	{
		if (ref.current && !ref.current.contains(e.target))
			action()
	}

	return ref
}

export default useClickOutside