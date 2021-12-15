import React, { useEffect, useState } from "react"
import {useLocation, Link} from "react-router-dom";
import styles from "./ConfirmEmailPage.module.css";
import Button from "@mui/material/Button";
import jwt from 'jwt-decode';
import User from "../../models/User";
import AuthService from "../../services/AuthService";

const ConfirmEmailPage = (props: { setLoggedIn: (loggedIn: boolean) => void }) => {

    const [emailVerified, setEmailVerified] = useState(false)
    const [tokenInvalid, setTokenInvalid] = useState(false)
    const [tokenExpired, setTokenExpired] = useState(false)
    const [name, setName] = useState("")
    const jwtVerifyToken = new URLSearchParams(useLocation().search).get('token');

    useEffect(() => {
        validateVerifyTokenWithBackend()
    }, []) // needs to run only once

    if (jwtVerifyToken === null || tokenInvalid)
        return (<div className={styles.confirmEmailPage}>
            <h1>Sorry, your link is invalid!</h1>
            <h3>Please make sure you copied the link correctly</h3>
        </div>)
    if (tokenExpired)
        return (<div className={styles.confirmEmailPage}>
            <h1>Sorry, your link has expired and your account has been deleted!</h1>
            <h3>Please repeat the registration process</h3>
        </div>)

    const validateVerifyTokenWithBackend = (): void => {
        // sends the verify token to the server for verification
        AuthService.verify_email(jwtVerifyToken).then((res) => {
            if (res.status === 200) {
                // Decoding JWT Token to get Account's Name
                const jwtVerifyTokenDecoded:User = jwt(jwtVerifyToken)
                setName(jwtVerifyTokenDecoded.name)
                // loggin user in
                props.setLoggedIn(true)
                setEmailVerified(true)
            } else if (res.status === 441)
                setTokenExpired(true)
            else
                setTokenInvalid(true)
        })
    }

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
    </div>)
}

export default ConfirmEmailPage
