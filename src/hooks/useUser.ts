import {useSession} from "next-auth/client"
import {useEffect, useState} from "react"

interface User
{
	id: string
	role: string
}

function useUser()
{
	const [session, loading] = useSession()
	const [user, setUser] = useState<User>(
	{
		id: 'not-logged',
		role: 'none'
	})

	useEffect(() =>
	{
		if (!loading)
		{
			const {user: tmpUser}:{user: any} = session
			setUser(tmpUser)
		}
	}, [loading, session])

	return {user, loading}
}

export default useUser