import React from "react"
import {Button} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

var name: string, email: string, password1: string, password2: string, type: string, university:string;

const RegistrationPage = () => {
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
    <select name="type" onChange={handleOnSelect}>
      <option value="student">Student</option>
      <option value="lecturer">Lecturer</option>
    </select>
    <h3>University:</h3>
    <select name="university" onChange={handleOnSelect}>
        <option value="tum">TUM</option>
    </select>
    <h3>Captcha:</h3>
    <Button variant="primary" onClick={registerButtonClick}>Register</Button>{' '}
  </div>)
}

function registerButtonClick() {

}

function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.name == "name") {
        name = e.currentTarget.value;
    } else if (e.currentTarget.name == "email") {
        email = e.currentTarget.value;
    } else if (e.currentTarget.name == "password1") {
        password1 = e.currentTarget.value;   
    } else if (e.currentTarget.name == "password2") {
        password2 = e.currentTarget.value;
    }
}

function handleOnSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.currentTarget.name == "type") {
        type = e.currentTarget.value;
    } else if (e.currentTarget.name == "university") {
        university = e.currentTarget.value;
    }
}

export default RegistrationPage
