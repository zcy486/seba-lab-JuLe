import React from 'react';
import './App.css';
import {Outlet, Link} from "react-router-dom";
import {Container} from "@mui/material";
import {Button} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <div>
      <Container maxWidth="lg">
        <h1>Welcome to JuLe</h1>
        <Link to="/login" className="btn btn-primary">Login</Link>
        <Link to="/register" className="btn btn-primary">Register</Link>
        <Outlet/>
      </Container>
    </div>
  );
}



export default App;
