import React from "react"
import ExerciseList from "../../components/ExerciseList/ExerciseList";
import {Button} from "@mui/material";
import {Link} from "react-router-dom";

const LecturerProfileContent = () => {
    return (
        <>
            <h2>My Exercises</h2>
            <Button variant="contained" component={Link} to="/exercises/create">New Exercise</Button>
            <ExerciseList />
        </>
    )
}

export default LecturerProfileContent
