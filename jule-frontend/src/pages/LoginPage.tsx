import React from "react"
import Button from "@mui/material/Button";
// @ts-ignore
import ReCAPTCHA from "react-google-recaptcha";
import config from "../config.json"
import AuthService from "../services/AuthService";
import User from "../models/User";
import Auth from "../models/Auth";

var email: string, password: string;

const LoginPage = () => {
  return (<div>
    <h1>Login</h1>
    <h3>Email:</h3>
    <input name="email" type="email" onChange={handleOnChange}/>
    <h3>Password:</h3>
    <input name="password" type="password" onChange={handleOnChange}/>
    <h3>Captcha:</h3>
    <ReCAPTCHA
        sitekey={config.recaptcha_sitekey}
        onChange={onCaptcha}
      />
    <br />
    <Button onClick={loginButtonClick}>Login</Button>{' '}
  </div>)
}

function onCaptcha(value: string) {
    console.log('Captcha value:', value);
}

function loginButtonClick() {
    let loginData : Auth = { email: email, password: password }
    AuthService.login(loginData).then((res) => {
      if (res.status === 200) {
          console.log('Successfully logged in')
          handleSignIn(res.data)
      } else if (res.status === 401) { // Wrong Email
          alert('Email does not exist! Please try again.')
      } else if (res.status === 403) { // Wrong Password
          alert('Wrong Password! Please try again.')
      } else { // Unknown error
          console.log(res)
          alert('Sorry, an unknown error has occured! Please try again.')
      }
  })
}

function handleSignIn(userFromBackend: User) {

}

function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.name === "email") {
        email = e.currentTarget.value;
    } else if (e.currentTarget.name === "password") {
        password = e.currentTarget.value;   
    }
}

export default LoginPage
