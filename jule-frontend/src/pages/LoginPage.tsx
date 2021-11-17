import React from "react"
import Button from "@mui/material/Button";
// @ts-ignore
import ReCAPTCHA from "react-google-recaptcha";

var email = "";
var password = "";

const LoginPage = () => {
  return (<div>
    <h1>Login</h1>
    <h3>Email:</h3>
    <input name="email" type="email" onChange={handleOnChange}/>
    <h3>Password:</h3>
    <input name="password" type="password" onChange={handleOnChange}/>
    <h3>Captcha:</h3>
    <ReCAPTCHA
        sitekey="6LfJGDgdAAAAAIaTVAMpnPVFubgbdIE_z_wNkv73"
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
    
}

function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.name == "email") {
        email = e.currentTarget.value;
    } else if (e.currentTarget.name == "password") {
        password = e.currentTarget.value;   
    }
}

export default LoginPage
