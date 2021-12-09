import React, { useState } from "react"
import Button from "@mui/material/Button";
// @ts-ignore
import ReCAPTCHA from "react-google-recaptcha";
import config from "../config.json"
import AuthService from "../services/AuthService";
import Auth from "../models/Auth";
import { Navigate } from 'react-router-dom'

const RegistrationPage = () => {

    const [navigate, setNavigate] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [role, setRole] = useState('student')
    const [universityId, setUniversityId] = useState(0)

    if (navigate) {
        return <Navigate to={"/register-complete?email=" + email} />
    }

    function registerButtonClick() {
        // TODO check if password1 equals password2

        let registrationData: Auth = { name: name, email: email, password: password1, role: role, universityId: universityId }

        AuthService.register(registrationData).then((res) => {
            if (res.status === 201) {
                console.log('Successfully created')
                setNavigate(true)
            } else if (res.status === 409) { // Email exists
                alert('Sorry, an Account with the Email address ' + email + ' already exists!')
            } else if (res.status === 406) { // The user input was not acceptable
                alert('Sorry, the content you entered was not acceptable! Please try again.')
            } else { // Unknown error
                console.log(res)
                alert('Sorry, an unknown error has occured! Please try again.')
            }
        })
    }

    function onCaptcha(value: string) {
        console.log('Captcha value:', value);
    }

    return (<div>
        <h1>Registration</h1>
        <h3>Your Name:</h3>
        <input name="name" type="text" onChange={e => setName(e.target.value)} />
        <h3>Email:</h3>
        <input name="email" type="email" onChange={e => setEmail(e.target.value)} />
        <h3>Password:</h3>
        <input name="password1" type="password" onChange={e => setPassword1(e.target.value)} />
        <h3>Retype Password:</h3>
        <input name="password2" type="password" onChange={e => setPassword2(e.target.value)} />
        <h3>Account Type:</h3>
        <select name="role" onChange={e => setRole(e.target.value)}>
            <option value='student'>Student</option>
            <option value='lecturer'>Lecturer</option>
        </select>
        <h3>University:</h3>
        <select name="universityId" onChange={e => setUniversityId(+e.target.value)}>
            <option value={0}>TUM</option>
        </select>
        <h3>Captcha:</h3>
        <ReCAPTCHA
            sitekey={config.recaptchaSitekey}
            onChange={onCaptcha}
        />
        <br />
        <Button onClick={registerButtonClick}>Register</Button>{' '}
    </div>)
}

export default RegistrationPage
