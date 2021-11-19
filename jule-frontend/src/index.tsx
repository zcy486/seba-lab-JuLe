import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import ErrorPage from "./pages/ErrorPage";
import ExercisesPage from "./pages/ExercisesPage/ExercisesPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import ImpressumPage from "./pages/ImpressumPage/ImpressumPage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<App/>}>
                    <Route path={""} element={<LandingPage/>}/>
                    <Route path={"exercises"} element={<ExercisesPage/>}/>
                    <Route path={"profile"} element={<ProfilePage/>}/>
                    <Route path={"impressum"} element={<ImpressumPage/>}/>
                    <Route path={"register"} element={<RegistrationPage />}/>
                    <Route path={"login"} element={<LoginPage />}/>
                    <Route path={"contact-us"} element={<ContactPage />}/>
                    <Route path={"*"} element={<ErrorPage/>}/>
                    
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
