import React from 'react';
import './App.css';
import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import NavigationBar from "./components/NavigationBar/NavigationBar";

function App() {
    return (
        <div>
            <NavigationBar loggedIn={true}/>
            <Container maxWidth="lg">
                <Outlet/>
            </Container>
        </div>
    );
}

export default App;
