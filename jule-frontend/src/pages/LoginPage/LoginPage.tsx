import React, { useState } from "react"
import Button from "@mui/material/Button";
import AuthService from "../../services/AuthService";
import User from "../../models/User";
import Auth from "../../models/Auth";
import { Navigate, Link} from 'react-router-dom'
import styles from "./LoginPage.module.css"
import { TextField } from "@mui/material";


const LoginPage = (props: { setLoggedIn: (loggedIn: boolean) => void }) => {

	const [navigate, setNavigate] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	if (navigate) {
        return <Navigate to={"/profile"} />
    }

	function loginButtonClick(e:React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		console.log('login button click?')
		let loginData: Auth = { email: email, password: password }
		AuthService.login(loginData).then((res) => {
			if (res.status === 200) {
				console.log('Successfully logged in')
				handleSignIn(res.data)
			} else if (res.status === 401) { // Wrong Email
				alert('Email does not exist! Please try again.')
			} else if (res.status === 403) { // Wrong Password
				alert('Wrong Password! Please try again.')
			} else { // Errors
				if (res.data.message === null)
					alert('Sorry, an unknown error has occured! Please try again.')
				else
					alert('The following error occured: ' + res.data.message)
			}
		})
	}

	function handleSignIn(userFromBackend: User) {
		props.setLoggedIn(true)
		setNavigate(true)
	}

	return (<div>
		<form onSubmit={(e) => loginButtonClick(e)}>
			<h1>Login</h1>
			<h3 className={styles.h3}>Email</h3>
			<TextField size={"small"} className={styles.loginInput} name="email" type="email" onChange={e => setEmail(e.target.value)} required/>
			<h3 className={styles.h3}>Password</h3>
			<TextField size={"small"} className={styles.loginInput} name="password" type="password" onChange={e => setPassword(e.target.value)} required/>
			<table className={styles.loginTable}>
				<tbody>
					<tr>
						<td style={{whiteSpace:"nowrap"}}>
							<Link className={styles.forgotPasswordLink} to={"/forgotPassword"}>Forgot password?</Link>
						</td>
						<td>
							<Button variant={"contained"} className={styles.loginButton} type="submit">Login</Button>{' '}
						</td>
					</tr>
				</tbody>
			</table>
		</form>
	</div>)
}

export default LoginPage
