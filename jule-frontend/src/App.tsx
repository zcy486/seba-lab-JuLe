import React from 'react';
import './App.css';
import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Link from '@mui/material/Link';

function App() {
  return (
    <div>
      <Container maxWidth="lg">
        <h1>Welcome to JuLe</h1>
        <Link component={RouterLink} to="/login" >Login</Link>
        &nbsp;
        <Link component={RouterLink} to="/register">Register</Link>
        <Outlet/>
      </Container>
    </div>
  );
}



export default App;
