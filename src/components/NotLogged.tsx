import { signIn } from "next-auth/client";

export default function NotLogged()
{
	return (
		<div>
			<h1>Você não está logado.</h1>
			<button onClick={() => signIn()}>Entrar</button>
		</div>
	)
}