import {useContext} from 'react'

import {AuthContext} from '../contexts/Auth'

function useAuth() {
	const auth = useContext(AuthContext)

	return auth
}

export default useAuth
