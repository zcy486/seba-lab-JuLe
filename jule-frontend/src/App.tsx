import React from 'react';
import './App.css';
import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import Footer from "./components/Footer/Footer";
import NavigationBar from "./components/NavigationBar/NavigationBar";

const App = () => (
    <>
        <NavigationBar loggedIn={true}/>
        <Container maxWidth="lg">
            <Outlet/>
        </Container>
        <div className={"verticalSpacer"}/>
        <Footer/>
    </>
);

export default App;
