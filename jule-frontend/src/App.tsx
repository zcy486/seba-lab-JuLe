import React from 'react';
import './App.css';
import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import Footer from "./components/Footer/Footer";
import NavigationBar from "./components/NavigationBar/NavigationBar";

function App() {
    return (
        <>
            <NavigationBar loggedIn={true}/>
            <Container maxWidth="lg">
                <Outlet/>
            </Container>
            <Footer/>
        </>
    );
}

export default App;
