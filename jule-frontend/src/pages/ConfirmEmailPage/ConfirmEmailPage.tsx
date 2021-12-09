import React, { useEffect, useState } from "react"
import {useLocation} from "react-router-dom";
import styles from "./ConfirmEmailPage.module.css";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import jwt from 'jwt-decode';
import User from "../../models/User";
import AuthService from "../../services/AuthService";

const ConfirmEmailPage = (props: { setLoggedIn: (loggedIn: boolean) => void }) => {

    const [emailVerified, setEmailVerified] = useState(false)
    const jwtVerifyToken = new URLSearchParams(useLocation().search).get('token');

    const invalidToken = (<div className={styles.confirmEmailPage}>
        <h1>Sorry, your link is invalid!</h1>
        <h3>Please make sure you copied the link correctly</h3>
    </div>)

    useEffect(() => {
        validateVerifyTokenWithBackend()
    }, []) // needs to run only once

    if (jwtVerifyToken === null)
        return invalidToken

    const validateVerifyTokenWithBackend = (): void => {
        // sends the verify token to the server for verification
        AuthService.verify_email(jwtVerifyToken).then((res) => {
            if (res.status === 200) {
                console.log('Successfully logged in')
                props.setLoggedIn(true)
                setEmailVerified(true)
            } else if (res.status === 401) { // Error has occured, message is attached
                alert('The following error occured: ' + res.data.message)
            } else { // Unknown error
                console.log(res)
                alert('Sorry, an unknown error has occured! Please try again.')
            }
        })
    }

    // Decoding JWT Token
    const jwtVerifyTokenDecoded:User = jwt(jwtVerifyToken)

    if (jwtVerifyTokenDecoded === null)
        return invalidToken

    const name = jwtVerifyTokenDecoded.name

    if (emailVerified) {
        return (<div className={styles.confirmEmailPage}>
            <h1>Your Email address has been verified!</h1>
            <h3>Thank you for signing up, {name}.</h3>
            <div className={styles.loginButtonSection}>
                <Button variant={"contained"} component={Link} to={"/profile"}>Continue to Profile</Button>
            </div>
        </div>)
    }

    return (<div className={styles.confirmEmailPage}>
        <h1>Please wait</h1>
        <h3>Thank you for signing up, {name}.</h3>
    </div>)
}

export default ConfirmEmailPage
