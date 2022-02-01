import React, { useEffect, useState } from "react"
import ActivityChart from "../../../components/ActivityChart/ActivityChart";
import UserService from "../../../services/UserService";
import StreakDisplay from "../../../components/StreakDisplay/StreakDisplay";
import config from "../../../config.json"
import ScoreGraph from "../../../components/ScoreGraph/ScoreGraph";
import ExerciseCard from "../../../components/ExerciseCard/ExerciseCard";
import Exercise from "../../../models/Exercise";
import SubmissionService from "../../../services/SubmissionService";
import GradeService from "../../../services/GradeService";
import ExerciseService from "../../../services/ExerciseService";
import Loading from "../../../components/Loading";
import styles from "./StudentProfileContent.module.css"
import { Button, Card, CardActions, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const StudentProfileContent = () => {

    // Helper functions
    const nullDays = (dayCount: number) => {
        const today = new Date()
        const shiftDate = (date: Date, dayShift: number) => {
            let newDate = new Date()
            newDate.setDate(newDate.getDate() + dayShift)
            return newDate
        }
        return Array.from(Array(dayCount).keys()).map((val: number) => {
            return { date: shiftDate(today, -val), count: 0 }
        }).reverse()
    }

    // States
    const [exerciseDateData, setExerciseDateData] = useState<{ date: Date; count: number }[]>(nullDays(180))
    const [hotStreak, setHotStreak] = useState<{ exerciseCount: number, dayCount: number }>({
        exerciseCount: 0,
        dayCount: 0
    })
    const [recentSubmissionGrades, setRecentSubmissionGrades] = useState<{ exercise: Exercise, score: number }[]>([])
    const [recentExercises, setRecentExercises] = useState<Exercise[] | undefined>(undefined)

    // Getters
    const getExerciseDateData = () => {
        UserService.getExerciseDateData().then(val => setExerciseDateData(val))
    }
    const getHotStreak = () => {
        UserService.getHotStreak().then(val => setHotStreak(val ? val : { exerciseCount: 0, dayCount: 0 }))
    }
    const getRecentExercises = async () => {
        await SubmissionService.getAllSubmissions().then(async submissions => {
            let exercises: Exercise[] = []
            for (const submission of submissions) {

                await ExerciseService.getExercise(submission.exerciseId.toString()).then(
                    async exercise => {
                        exercises.push(exercise);
                    }
                )
            }
            return exercises
        }).then(val => {
            setRecentExercises(val)
        }
        )

    }
    const getRecentSubmissionGrades = async () => {

        await SubmissionService.getAllSubmissions().then(async submissions => {
            let submissionGrades: { exercise: Exercise, score: number }[] = []
            for (const submission of submissions) {
                await GradeService.getGrade(submission.exerciseId).then(async grade => {
                    await ExerciseService.getExercise(submission.exerciseId.toString()).then(
                        async exercise => {
                            submissionGrades.push({ exercise: exercise, score: grade.score });
                        }
                    )
                })
            }
            return submissionGrades
        }).then(val => {
            setRecentSubmissionGrades(val)
        }
        )
    }

    // Set states when loading the component
    useEffect(() => {
        getExerciseDateData()
        getHotStreak()
        getRecentExercises()
        getRecentSubmissionGrades()
    }, [])

    /* Conditional components */
    // Shows StreakDisplay if the criteria is met as defined by config.json
    const HotStreak = () => {
        if (hotStreak.exerciseCount >= config.hotStreak.minExercises && hotStreak.dayCount >= config.hotStreak.minDays) {
            return <StreakDisplay exerciseCount={hotStreak.exerciseCount} dayCount={hotStreak.dayCount} />
        } else {
            return <></>
        }
    }

    return (
        <div>
            <h2>Activity</h2>
            <div className={"centerDiv"}>
                <ActivityChart exerciseData={exerciseDateData} />
            </div>
            <div className={"verticalSpacer"} />
            <HotStreak />
            {
                recentExercises ?
                    recentExercises.length === 0 ?
                        <div className={styles.cardDiv}>
                            <Card sx={{ width: "25rem", padding: "2rem 2rem 1rem 2rem"}}>
                                <Typography variant="h4" align="center">
                                    Welcome To Your New Profile
                                </Typography>
                                <div className="verticalSpacer"/>
                                <Typography align="center">
                                    Complete some exercises to start seeing your progress on your profile!
                                </Typography>
                                <CardActions sx={{display: "flex", justifyContent: "center", marginTop: "0.5rem"}}>
                                    <Button variant="contained" component={Link} to={"/exercises"}>Exercises</Button>
                                </CardActions>
                            </Card>
                        </div>
                        :
                        <>
                            <h2>Scores</h2>
                            <div className={"centerDiv"}>
                                <ScoreGraph data={recentSubmissionGrades} />
                            </div>
                            <h2>Latest Exercises</h2>
                            {recentExercises?.map((data, i) => {
                                return (
                                    <ExerciseCard key={i}
                                        id={data.id!}
                                        title={data.title!}
                                        exerciseTags={data.tags.map(tag => tag.name)!}
                                    />
                                );
                            })}
                        </>
                    :
                    <Loading />
            }

        </div>
    )
}

export default StudentProfileContent
