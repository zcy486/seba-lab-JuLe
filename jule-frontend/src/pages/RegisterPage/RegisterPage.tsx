import React, { useEffect, useState } from "react"
import Button from "@mui/material/Button";
// @ts-ignore
import ReCAPTCHA from "react-google-recaptcha";
import config from "../../config.json"
import AuthService from "../../services/AuthService";
import Auth from "../../models/Auth";
import UniversityService from "../../services/UniversityService";
import University from "../../models/University";
import styles from "./RegisterPage.module.css"
import { MenuItem, Select, TextField } from "@mui/material";
import {SelectChangeEvent} from "@mui/material/Select";

const RegisterPage = () => {

    const [navigate, setNavigate] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('student')
    const [universityId, setUniversityId] = useState(0)
    const [universities, setUniversities] = useState<University[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [captchaSucceeded, setCaptchaSucceeded] = useState(false);

    const onSelectUniversity = (e: SelectChangeEvent) => { setUniversityId(Number(e.target.value)) };
    const onSelectRole = (e: SelectChangeEvent) => { setRole(e.target.value) };

    const handleTogglePassword = () => setShowPassword(showPassword => !showPassword);


    useEffect(() => {
        fetchAvailableUniversitiesFromBackend()
    }, []) // needs to run only once

    const fetchAvailableUniversitiesFromBackend = (): void => {
        UniversityService.getAll().then(res => setUniversities(res))
        console.log('universities fetched!')
    }

    if (navigate) {
        return <div>
            <h1 style={{textAlign: 'center'}}>Please Verify your Email address to complete the registration</h1>
            <h3 style={{textAlign: 'center'}}>an email to {email} has been sent.</h3>
        </div>
    }

    function registerButtonClick(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (captchaSucceeded) {
            let registrationData: Auth = { name: name, email: email, password: password, role: role, universityId: universityId }
            AuthService.register(registrationData).then((res) => {
                if (res.status === 201)
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
        <form onSubmit={(e) => registerButtonClick(e)}>
            <h1>Register</h1>
            <h3 className={styles.h3}>Full Name</h3>
            <TextField size={"small"} className={styles.registerInput} name="name" type="text" onChange={e => setName(e.target.value)} required/>
            <h3 className={styles.h3}>Email</h3>
            <TextField size={"small"} className={styles.registerInput} name="email" type="email" onChange={e => setEmail(e.target.value)} required/>
            <div className={styles.showPasswordContainer}>
                <h3 className={styles.h3}>Password</h3>
                <span className={styles.togglePassword} onClick={handleTogglePassword}>{showPassword ? <div><img className={styles.eyeImage} src={"/eye_hidden.svg"} alt={'Hide password'}/>Hide</div> : <div><img className={styles.eyeImage} src={"/eye.svg"} alt={'Show password'}/>Show</div>}</span>
            </div>
            <TextField size={"small"} className={styles.registerInput} name="password" type={showPassword ? 'text' : 'password'} onChange={e => setPassword(e.target.value)} required/>
            <h3 className={styles.h3}>Account Role</h3>
            
            <Select value={role} name="role" onChange={onSelectRole} sx={{width: '100%', maxWidth: '320px'}}>
                <MenuItem value='student'>Student</MenuItem>
                <MenuItem value='lecturer'>Lecturer</MenuItem>
            </Select>
            <h3 className={styles.h3}>University</h3>
            <Select value={''+universityId} name="universityId" onChange={onSelectUniversity} sx={{width: '100%', maxWidth: '320px'}}>
                { universities.map((element, index) => <MenuItem value={index}>{element.name}</MenuItem>) }
            </Select>
            <h3 className={styles.h3}>Captcha</h3>
            <ReCAPTCHA
                sitekey={config.recaptchaSiteKey}
                onChange={onCaptcha}
            />
            <br />
            <Button variant={"contained"} type="submit">Register</Button>{' '}
        </form>
    </div>)
}

export default RegisterPage
