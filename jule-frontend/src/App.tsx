import React from 'react';
import './App.css';
import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import Footer from "./components/Footer/Footer";
import NavigationBar from "./components/NavigationBar/NavigationBar";

function App() {
    return (
        <>
            <Container maxWidth="lg" className={"content"}>
                <Outlet/>

            </Container>
            <Footer/>
        </>
    );
}

export default App;
