import React from 'react';
import './App.css';
import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";

function App() {
  return (
    <div>
      <Container maxWidth="lg">
        <Outlet/>
      </Container>
    </div>
  );
}

export default App;
