import React, {useState} from "react"

import Button from "@mui/material/Button";
// @ts-ignore
import ReCAPTCHA from "react-google-recaptcha";
import config from "../../config.json"
import AuthService from "../../services/AuthService";
import styles from "../ContactPage/ContactPage.module.css";
import {TextareaAutosize, TextField} from "@mui/material";


const ContactPage = () => {

    const [navigate, setNavigate] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [captchaSucceeded, setCaptchaSucceeded] = useState(false);

    if (navigate) {
        return <div>
            <h1 style={{textAlign: 'center'}}>Thank you for contacting us</h1>
            <h3 style={{textAlign: 'center'}}>we have received your message.</h3>
        </div>
    }

    function contactButtonClick(e:React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
        if (captchaSucceeded) {
            AuthService.contact(name, email, message).then((res) => {
                if (res.status === 200)
                    setNavigate(true)
                else if (res.data !== null && res.data.message !== null) // Known Error
                    alert(res.data.message)
                else // Unknown Error
                    alert('Sorry, an unknown error has occurred! Please try again.')
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
        <form onSubmit={(e) => contactButtonClick(e)}>
            <h1>Contact Us</h1>
            <h3 className={styles.h3}>Full Name</h3>
            <TextField size={"small"} className={styles.contactInput} name="name" type="text" onChange={e => setName(e.target.value)} required/>
            <h3 className={styles.h3}>Email</h3>
			<TextField size={"small"} className={styles.contactInput} name="email" type="email" onChange={e => setEmail(e.target.value)} required/>
            <h3 className={styles.h3}>Message</h3>
            <TextareaAutosize className={styles.contactTextArea} minRows={5} maxRows={10} name="message" onChange={e => setMessage(e.target.value)} required/>
            <h3 className={styles.h3}>Captcha</h3>
            <ReCAPTCHA
                sitekey={config.recaptchaSiteKey}
                onChange={onCaptcha}
            />
            <br/>
            <Button variant={"contained"} type="submit">Submit</Button>{' '}
        </form>
    </div>)
}

export default ContactPage
