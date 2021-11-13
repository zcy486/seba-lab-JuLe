import React from 'react';
import './App.css';
import routes from "./routes";
import {Route, Routes} from "react-router-dom";
import {Container} from "@mui/material";

function App() {
    return (
        <div>
            <React.Fragment>
                <Container maxWidth={"lg"}>
                    <Routes>
                        {routes.map((route, i) => (
                            <Route key={i} {...route} />
                        ))}
                    </Routes>
                </Container>
            </React.Fragment>
        </div>
    );
}

export default App;
