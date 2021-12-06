import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {Link, useNavigate} from "react-router-dom";

let NavigationBar = (props: {loggedIn: boolean, setLoggedIn:(loggedIn: boolean)=>void}) => {


    useEffect(()=> {
        console.log(props.loggedIn)
        if (localStorage.getItem('jwtToken') === null)
            props.setLoggedIn(false)
        else
            props.setLoggedIn(true)
    });
    
    const navigate = useNavigate();
    const goToLoginPage = () => {
        localStorage.removeItem('jwtToken')
        props.setLoggedIn(false)
        navigate('/login')
    }
    
    return (
        <Box sx={{flexGrow: 1}} style={{position: "sticky"}}>
            <AppBar style={{position: "sticky"}}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <img
                            src={"/JuLe.svg"}
                            style={{left: 0}}
                            alt="JuLe logo"
                            height="30"
                            onClick={() => {
                            }}
                        />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    </Typography>
                    {props.loggedIn ? (
                        <div className="nav-options">
                            <Button color="inherit" component={Link} to={"/exercises"}>Exercises</Button>
                            <Button color="inherit" component={Link} to={"/profile"}>Profile</Button>
                            <Button color="inherit" onClick={goToLoginPage}>Logout</Button>
                        </div>
                    ) : (
                        <div className="nav-options">
                            <Button color="inherit" component={Link} to={"/login"}>Login</Button>
                            <Button color="inherit" component={Link} to={"/register"}>Register</Button>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NavigationBar
