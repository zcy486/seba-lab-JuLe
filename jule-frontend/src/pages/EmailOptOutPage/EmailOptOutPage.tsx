import React, { useEffect, useState } from "react"
import {useLocation, Link} from "react-router-dom";
import config from "../../config.json"
import AuthService from "../../services/AuthService";
import UserService from "../../services/UserService";
import Auth from "../../models/Auth";
import styles from "./EmailOptOutPage.module.css"
import { MenuItem, Select, TextField, Grid, Button } from "@mui/material";
import {SelectChangeEvent} from "@mui/material/Select";
import User from "../../models/User";
import jwt from 'jwt-decode';

const EmailOptOutPage = () => {

    // States
    const [user, setUser] = useState<User>()
    const [navigate, setNavigate] = useState(false)
    const [noToken, setNoToken] = useState(false)
    const [optOutSetting, setOptOutSetting] = useState('true')

    const onSelectSetting = (e: SelectChangeEvent) => { setOptOutSetting(e.target.value) };
    // TODO: decide if this email has any use case
    const email = new URLSearchParams(useLocation().search).get('email');
    let jwtToken = localStorage.getItem('jwtToken')


    // Set states when loading the component
    useEffect(() => {
        if (jwtToken === null) {
            setNoToken(true)
        } else {
            getUser()
            /*
            setNoToken(false)
            console.log(jwtToken)
            const jwtTokenDecoded:User = jwt(jwtToken)
            console.log(jwtTokenDecoded.name)
            setName(jwtTokenDecoded.name)
            */
        }
    }, [])

    if (noToken) {
        return <div>
            <h1 style={{textAlign: 'center'}}>Please Login to your Account</h1>
            <h3 style={{textAlign: 'center'}}>Authentication is required to change email recommendation settings</h3>
            <Grid className={styles.optOutButtonGrid}>
                <Button variant={"contained"} component={Link} to={"/login"}>Proceed to Login</Button>
            </Grid>
        </div>
    }

    // Getters
    const getUser = () => {
        UserService.getCurrentUser().then(val => setUser(val)).catch(err => setNoToken(true))
    }

    if (navigate) {
        return <div>
            <h1 style={{textAlign: 'center'}}>Your settings have been saved</h1>
            <Grid className={styles.optOutButtonGrid}>
                <Button variant={"contained"} component={Link} to={"/profile"}>Proceed to Profile</Button>
            </Grid>
        </div>
    }

    function optOutButtonClick(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        AuthService.optOutEmailRecommendation(optOutSetting).then((res) => {
            if (res.status === 200)
                setNavigate(true)
            else if (res.status === 439 || res.status === 440 || res.status === 441)
                setNoToken(true)
            else if (res.data !== null && res.data.message !== null) // Known Error
                alert(res.data.message)
            else // Unknown Error
                alert('Sorry, an unknown error has occurred! Please try again.')
        })
    }

    return (<div>
        <form onSubmit={(e) => optOutButtonClick(e)}>
            <h1>Hello, {user?.name}</h1>
            <h3 className={styles.h3}>Receive Email Recommendations?</h3>
            <Select value={optOutSetting} name="optOutSetting" onChange={onSelectSetting} sx={{width: '100%', maxWidth: '320px'}}>
                <MenuItem value='true'>Yes</MenuItem>
                <MenuItem value='false'>No</MenuItem>
            </Select>
            <br /><br />
            <Button variant={"contained"} type="submit">Save Setting</Button>{' '}
        </form>
    </div>)
}

export default EmailOptOutPage
