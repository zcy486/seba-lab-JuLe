import React from "react"
import ExerciseList from "../../../components/ExerciseList/ExerciseList";
import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import styles from "./LectureProfileContent.module.css"

const LecturerProfileContent = () => {
    return (
        <>
            <div className={styles.exerciseHeaderDiv}>
                <h2>My Exercises</h2>
                <Button variant="contained" component={Link} to="/exercises/create">New Exercise</Button>
            </div>
            <ExerciseList onlyCurrentOwned={true}/>
        </>
    )
}

export default LecturerProfileContent
