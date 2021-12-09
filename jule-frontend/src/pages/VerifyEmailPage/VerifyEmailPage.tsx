import React from "react"
import {useLocation} from "react-router-dom";
import styles from "./VerifyEmailPage.module.css";

const VerifyEmailPage = () => {
    const email = new URLSearchParams(useLocation().search).get('email');
    return (<div className={styles.verifyEmailPage}>
        <h1>Please Verify your Email address to complete the registration</h1>
        <h3>an email to {email} has been sent.</h3>
    </div>)
}

export default VerifyEmailPage
