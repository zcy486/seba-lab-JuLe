import React from 'react';
import './App.css';
import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import {Button} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <Container maxWidth="lg">
        <h1>Welcome to JuLe</h1>
        <Button variant="outline-primary">Login</Button>{' '}
        <Button variant="outline-primary">Register</Button>{' '}
        <Outlet/>
      </Container>
    </div>
  );
}

export default App;
