import React from "react"
import styles from "./LandingPage.module.css"
import Button from "@mui/material/Button";
import YouTube from "react-youtube";
import config from "../../config.json"
import {Link} from "react-router-dom"

const LandingPage = () => {

    // TODO: change to actual video
    const videoId = config.landingVideo.videoId

    return (
        <div className={styles.landingPage}>
            <h1>Welcome to JuLe</h1>
            <div className={styles.sideBySide}>
                <img src={"/relaxing.png"} className={styles.image} alt={"Relaxing"}/>
                <div className={styles.stack}>
                    <p>
                        Improving your legal writing one exercise at a time with industry leading analytical Natural
                        Language
                        Processing to give instant feedback and help you develop your legal writing.
                    </p>
                    <Button variant={"contained"} component={Link} to={"/register"}>Get Started</Button>
                </div>
            </div>
            <div className={"verticalSpacer"}/>
            <h2>Example Exercise</h2>
            <YouTube videoId={videoId}/>
            <div className={"verticalSpacer"}/>
            <Button variant={"contained"} component={Link} to={"/register"}>Sign Up</Button>
        </div>
    );
};

export default LandingPage
