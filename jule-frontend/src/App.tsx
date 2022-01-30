import React, { useState } from 'react';
import './App.css';
import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import Footer from "./components/Footer/Footer";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ErrorPage from "./pages/ErrorPage";
import ExercisesPage from "./pages/Exercises/ExercisesPage/ExercisesPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import ImpressumPage from "./pages/ImpressumPage/ImpressumPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import NewExercisePage from "./pages/Exercises/NewExercisePage";
import ExerciseDetailPage from "./pages/Exercises/ExerciseDetailPage";
import EditExercisePage from "./pages/Exercises/EditExercisePage";
import ConfirmEmailPage from "./pages/ConfirmEmailPage/ConfirmEmailPage";
import ExerciseResultPage from "./pages/Exercises/ExerciseResultPage";
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage';


const App = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    return (
    <>
        <BrowserRouter>
            <div className="content">
                <NavigationBar loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
                <Container maxWidth="lg">
                    <Outlet/>
                    <Routes>
                        <Route path={""} element={<LandingPage/>}/>
                        <Route path={"exercises"}>
                            <Route path={":id"}>
                                <Route path={"edit"} element={<EditExercisePage/>}/>
                                <Route path={"results"} element={<ExerciseResultPage/>}/>
                                <Route path={""} element={<ExerciseDetailPage/>}/>
                            </Route>
                            <Route path={"create"} element={<NewExercisePage/>}/>
                            <Route path={""} element={<ExercisesPage/>}/>
                        </Route>
                        <Route path={"profile"} element={<ProfilePage/>}/>
                        <Route path={"impressum"} element={<ImpressumPage/>}/>
                        <Route path={"register"} element={<RegisterPage/>}/>
                        <Route path={"reset-password"} element={<ResetPasswordPage setLoggedIn={setLoggedIn}/>}/>
                        <Route path={"confirm-email"} element={<ConfirmEmailPage setLoggedIn={setLoggedIn}/>}/>
                        <Route path={"login"} element={<LoginPage setLoggedIn={setLoggedIn}/>}/>
                        <Route path={"forgot-password"} element={<ForgotPasswordPage/>}/>
                        <Route path={"contact-us"} element={<ContactPage/>}/>
                        <Route path={"*"} element={<ErrorPage/>}/>
                    </Routes>
                </Container>
            <div className={"verticalSpacer"}/>
            </div>
            <Footer/>
        </BrowserRouter>
    </>)
}

export default App;
