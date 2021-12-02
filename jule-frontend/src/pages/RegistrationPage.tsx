import React, {useState} from "react"
import Button from "@mui/material/Button";
// @ts-ignore
import ReCAPTCHA from "react-google-recaptcha";
import config from "../config.json"
import AuthService from "../services/AuthService";
import Auth from "../models/Auth";
import {Navigate} from 'react-router-dom'

var name: string, email: string, password1: string, password2: string, role: string, university:string

const RegistrationPage = () => {

    const [navigate, setNavigate] = useState(false)

    if (navigate) {
        return <Navigate to={"/register-complete?email=" + email}/>
    }

    function registerButtonClick() {
        // TODO check if password1 equals password2
    
        let registrationData : Auth = { name: name, email: email, password: password1, role: role, university_id: university }
    
        AuthService.register(registrationData).then((res) => {
            if (res.status === 200) {
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
    
    function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
        if (e.currentTarget.name === "name") {
            name = e.currentTarget.value
        } else if (e.currentTarget.name === "email") {
            email = e.currentTarget.value
        } else if (e.currentTarget.name === "password1") {
            password1 = e.currentTarget.value
        } else if (e.currentTarget.name === "password2") {
            password2 = e.currentTarget.value
        }
    }
    
    function handleOnSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        if (e.currentTarget.name === "role") {
            role = e.currentTarget.value
        } else if (e.currentTarget.name === "university") {
            university = e.currentTarget.value
        }
    }

    return (<div>
        <h1>Registration</h1>
        <h3>Your Name:</h3>
        <input name="name" type="text" onChange={handleOnChange}/>
        <h3>Email:</h3>
        <input name="email" type="email" onChange={handleOnChange}/>
        <h3>Password:</h3>
        <input name="password1" type="password" onChange={handleOnChange}/>
        <h3>Retype Password:</h3>
        <input name="password2" type="password" onChange={handleOnChange}/>
        <h3>Account Type:</h3>
        <select name="role" onChange={handleOnSelect}>
        <option value="student">Student</option>
        <option value="lecturer">Lecturer</option>
        </select>
        <h3>University:</h3>
        <select name="university" onChange={handleOnSelect}>
            <option value="tum">TUM</option>
        </select>
        <h3>Captcha:</h3>
        <ReCAPTCHA
            sitekey={config.recaptcha_sitekey}
            onChange={onCaptcha}
        />
        <br />
        <Button onClick={registerButtonClick}>Register</Button>{' '}
    </div>)
}

export default RegistrationPage
