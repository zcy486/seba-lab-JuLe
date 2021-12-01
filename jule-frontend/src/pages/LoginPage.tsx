import React from "react"
import Button from "@mui/material/Button";
// @ts-ignore
import ReCAPTCHA from "react-google-recaptcha";
import config from "../config.json"
import AuthService from "../services/AuthService";

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
    AuthService.login(email, password).then(response => console.log('response', response));
}

function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.name === "email") {
        email = e.currentTarget.value;
    } else if (e.currentTarget.name === "password") {
        password = e.currentTarget.value;   
    }
}

export default LoginPage
