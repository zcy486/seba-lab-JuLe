import React, { useState } from "react"
import Button from "@mui/material/Button";
// @ts-ignore
import ReCAPTCHA from "react-google-recaptcha";
import config from "../config.json"
import AuthService from "../services/AuthService";
import User from "../models/User";
import Auth from "../models/Auth";
import { Navigate } from 'react-router-dom'

const LoginPage = (props: { setLoggedIn: (loggedIn: boolean) => void }) => {

	const [navigate, setNavigate] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	if (navigate) {
        return <Navigate to={"/profile"} />
    }

	function onCaptcha(value: string) {
		console.log('Captcha value:', value);
	}

	function loginButtonClick() {
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
		<h1>Login</h1>
		<h3>Email:</h3>
		<input name="email" type="email" onChange={e => setEmail(e.target.value)} />
		<h3>Password:</h3>
		<input name="password" type="password" onChange={e => setPassword(e.target.value)} />
		<h3>Captcha:</h3>
		<ReCAPTCHA
			sitekey={config.recaptchaSitekey}
			onChange={onCaptcha}
		/>
		<br />
		<Button onClick={loginButtonClick}>Login</Button>{' '}
	</div>)
}

export default LoginPage
