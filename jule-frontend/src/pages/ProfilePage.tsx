import React, {useEffect, useState} from "react"
import ActivityChart from "../components/ActivityChart/ActivityChart";
import UserService from "../services/UserService";
import StreakDisplay from "../components/StreakDisplay/StreakDisplay";
import config from "../config.json"
import ScoreGraph from "../components/ScoreGraph/ScoreGraph";
import ExerciseCard from "../components/ExerciseCard/ExerciseCard";
import {mockExercises} from "../services/MockData";

const ProfilePage = () => {

    // Helper functions
    const nullDays = (dayCount: number) => {
        const today = new Date()
        const shiftDate = (date: Date, dayShift: number) => {
            let newDate = new Date()
            newDate.setDate(newDate.getDate() + dayShift)
            return newDate
        }
        return Array.from(Array(dayCount).keys()).map((val: number) => {
            return {date: shiftDate(today, -val), count: 0}
        }).reverse()
    }

    // States
    const [userName, setUserName] = useState<string>(" ")
    const [exerciseDateData, setExerciseDateData] = useState<{ date: Date; count: number }[]>(nullDays(180))
    const [hotStreak, setHotStreak] = useState<{ exerciseCount: number, dayCount: number }>({
        exerciseCount: 0,
        dayCount: 0
    })

    // Getters
    const getUserName = () => {
        UserService.getName().then(val => setUserName(val))
    }
    const getExerciseDateData = () => {
        UserService.getExerciseDateData().then(val => setExerciseDateData(val))
    }
    const getHotStreak = () => {
        UserService.getHotStreak().then(val => setHotStreak(val ? val : {exerciseCount: 0, dayCount: 0}))
    }

    // Set states when loading the component
    useEffect(() => {
        getUserName()
        getExerciseDateData()
        getHotStreak()
    }, [])

    /* Conditional components */
    // Shows StreakDisplay if the criteria is met as defined by config.json
    const HotStreak = () => {
        if (hotStreak.exerciseCount >= config.hotStreak.minExercises && hotStreak.dayCount >= config.hotStreak.minDays) {
            return <StreakDisplay exerciseCount={hotStreak.exerciseCount} dayCount={hotStreak.dayCount}/>
        } else {
            return <></>
        }
    }

    return (
        <div>
            <h1>{userName}</h1>
            <h2>Activity</h2>
            <div className={"centerDiv"}>
                <ActivityChart exerciseData={exerciseDateData}/>
            </div>
            <div className={"verticalSpacer"}/>
            <HotStreak/>
            <h2>Scores</h2>
            <div className={"centerDiv"}>
                <ScoreGraph/>
            </div>
            <h2>Latest Exercises</h2>
            {mockExercises.map((mockdata, i) => {
                return (
                    <ExerciseCard key={i}
                                  title={mockdata.title!}
                                  exerciseTags={mockdata.exerciseTags!}
                    />
                );
            })}
        </div>
    )
}

export default ProfilePage
