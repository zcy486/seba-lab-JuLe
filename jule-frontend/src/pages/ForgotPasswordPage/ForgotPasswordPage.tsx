import React, { useState } from "react"
import Button from "@mui/material/Button";
// @ts-ignore
import ReCAPTCHA from "react-google-recaptcha";
import config from "../../config.json"
import AuthService from "../../services/AuthService";
import styles from "./ForgotPasswordPage.module.css"
import { TextField } from "@mui/material";

const ForgotPasswordPage = () => {

    const [sendEmailSucceeded, setSendEmailSucceeded] = useState(false)
    const [email, setEmail] = useState('')

    const [captchaSucceeded, setCaptchaSucceeded] = useState(false);

    if (sendEmailSucceeded) {
        return <div>
            <h1 style={{textAlign: 'center'}}>Please check your Email address to reset your password</h1>
            <h3 style={{textAlign: 'center'}}>an email to {email} has been sent.</h3>
        </div>
    }

    function forgotPasswordButtonClick(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (captchaSucceeded) {
            AuthService.sendResetPasswordEmail(email).then((res) => {
                if (res.status === 201)
                    setSendEmailSucceeded(true)
                else if (res.data !== null && res.data.message !== null) // Known Error
                    alert(res.data.message)
                else // Unknown Error
                    alert('Sorry, an unknown error has occured! Please try again.')
            })
        } else {
            alert('Please fill in the captcha')
        }
    }

    function onCaptcha(value: string) {
        AuthService.verify_captcha(value).then((res) => {
            if (res !== undefined && res.status === 200)
                setCaptchaSucceeded(true)
        })
    }


    return (<div>
        <form onSubmit={(e) => forgotPasswordButtonClick(e)}>
            <h1>Forgot password</h1>
            <h3 className={styles.h3}>Email:</h3>
            <TextField size={"small"} className={styles.forgotPasswordInput} name="email" type="email" onChange={e => setEmail(e.target.value)} required/>
            
            <h3 className={styles.h3}>Captcha:</h3>
            <ReCAPTCHA
                sitekey={config.recaptchaSiteKey}
                onChange={onCaptcha}
            />
            <br />
            <Button variant={"contained"} type="submit">Reset my password</Button>{' '}
        </form>
    </div>)
}

export default ForgotPasswordPage
