import React, { useState } from "react"
import {useLocation, Link} from "react-router-dom";
import styles from "./ResetPasswordPage.module.css";
import User from "../../models/User";
import jwt from 'jwt-decode';
import { Button, TextField } from "@mui/material";
import AuthService from "../../services/AuthService";


const ResetPasswordPage = (props: { setLoggedIn: (loggedIn: boolean) => void }) => {

    const jwtResetToken = new URLSearchParams(useLocation().search).get('token');
    const [passwordChanged, setPasswordChanged] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('')

    const handleTogglePassword = () => setShowPassword(showPassword => !showPassword);

    const invalidToken = (<div className={styles.confirmEmailPage}>
        <h1>Sorry, your link is invalid!</h1>
        <h3>Please repeat the reset password process</h3>
    </div>)

    if (jwtResetToken === null)
        return invalidToken

    // Decoding JWT Token
    const jwtResetTokenDecoded:User = jwt(jwtResetToken)

    if (jwtResetTokenDecoded === null)
        return invalidToken

    const name = jwtResetTokenDecoded.name

    if (passwordChanged) {
        return (<div className={styles.confirmEmailPage}>
            <h1>Your password has been changed!</h1>
            <h3>Thank you for using JuLe, {name}</h3>
            <div className={styles.loginButtonSection}>
                <Button variant={"contained"} component={Link} to={"/profile"}>Continue to Profile</Button>
            </div>
        </div>)
    }

    function resetPasswordButtonClick(e:React.FormEvent<HTMLFormElement>) {
        // sends the reset token to the server for verification
        e.preventDefault()
        if (jwtResetToken !== null) {
            AuthService.changePassword(jwtResetToken, password).then((res) => {
                if (res.status === 200) {
                    props.setLoggedIn(true)
                    setPasswordChanged(true)
                } else if (res.data !== null && res.data.message !== null) // Known Error
                    alert(res.data.message)
                else // Unknown Error
                    alert('Sorry, an unknown error has occured! Please try again.')
            })
        } else {
            alert('Sorry, your link has expired! Please repeat the reset password process.')
        }
    }

    return (<div>
        <form onSubmit={(e) => resetPasswordButtonClick(e)}>
            <h1>Reset Password</h1>
            <div className={styles.showResetPasswordContainer}>
                <h3 className={styles.h3}>Password:</h3>
                <span className={styles.togglePassword} onClick={handleTogglePassword}>{showPassword ? <div><img className={styles.eyeImage} src={"/eye_hidden.svg"}/>Hide</div> : <div><img className={styles.eyeImage} src={"/eye.svg"}/>Show</div>}</span>
            </div>
            <TextField size={"small"} className={styles.resetPasswordInput} name="password" type={showPassword ? 'text' : 'password'} onChange={e => setPassword(e.target.value)} required/>
            <br /><br />
            <Button variant={"contained"} type="submit">Change password</Button>{' '}
        </form>
    </div>)
}

export default ResetPasswordPage
