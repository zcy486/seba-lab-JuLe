import React from "react"
import {Button} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <Button variant="primary" onClick={loginButtonClick}>Login</Button>{' '}
  </div>)
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
