import {NextApiHandler} from 'next'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import api from '../../../services/api'

const config =
{
	secret: process.env.AUTH_SECRET,
	pages:
	{
		signIn: '/login'
	},
	providers:
	[
		Providers.Credentials(
		{
			name: 'e-mail e senha',
			credentials:
			{
				email: {label: 'E-mail', type: 'text', placeholder: 'usuario@exemplo.com'},
				password: {label: 'Senha', type: 'password'}
			},
			authorize: async credentials =>
			{
				const data = {email: credentials.email, password: credentials.password}

				const res = await api.post('login/seller', data)

				const {token, role} = res.data

				if (token) return Promise.resolve({token, role})
				else return Promise.resolve(null)
			}
		})
	],
	callbacks:
	{
		jwt: async (token, user) =>
		{
			user && (token.user = user)
			return Promise.resolve(token)
		},
		session: async (session, user) =>
		{
			session.user = user.user
			return Promise.resolve(session)
		}
	}
}

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, config)
export default authHandler