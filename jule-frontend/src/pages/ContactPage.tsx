import React from "react"

import Button from "@mui/material/Button";
// @ts-ignore
import ReCAPTCHA from "react-google-recaptcha";

var name: string, email: string, message: string;

const ContactPage = () => {
  return (<div>
    <h1>Contact Us</h1>
    <h3>Your Name:</h3>
    <input name="name" type="text" onChange={handleOnChange}/>
    <h3>Email:</h3>
    <input name="email" type="email" onChange={handleOnChange}/>
    <h3>Message:</h3>
    <textarea name="message" onChange={handleOnTextChange}/>
    <h3>Captcha:</h3>
    <ReCAPTCHA
        sitekey="6LfJGDgdAAAAAIaTVAMpnPVFubgbdIE_z_wNkv73"
        onChange={onCaptcha}
      />
    <br />
    <Button onClick={submitButtonClick}>Submit</Button>{' '}
  </div>)
}

function onCaptcha(value: string) {
    console.log('Captcha value:', value);
}

function submitButtonClick() {
    
}

function handleOnTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    message = e.currentTarget.value;
}

function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
    if (e.currentTarget.name == "name") {
        name = e.currentTarget.value;
    } else if (e.currentTarget.name == "email") {
        email = e.currentTarget.value;   
    } else if (e.currentTarget.name == "message") {
        message = e.currentTarget.value;   
    }
}

export default ContactPage
