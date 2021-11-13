import React from "react";
import SearchBar from "../components/SearchBar/SearchBar";
import ExerciseCard from "../components/ExerciseCard/ExerciseCard";

//TODO: replace mock data
const mockExercises = [
    {
        title: "Exercise 1",
        exerciseTags: ["indirekte Rede"],
        finished: false
    },
    {
        title: "Exercise 2",
        exerciseTags: ["Schachtelsatz"],
        finished: true
    },
    {
        title: "Exercise 3",
        exerciseTags: ["Grammatik", "Gutachtenstil"],
        finished: false
    },
    {
        title: "Exercise 4",
        exerciseTags: [],
        finished: false
    },
    {
        title: "Exercise 5",
        exerciseTags: ["Verständlichkeit"],
        finished: true
    }
];

const OverviewPage = () => {
    return (
        <>
            <h1>Available Exercises</h1>
            <SearchBar/>
            {mockExercises.map((mockdata, i) => {
                return (
                    <ExerciseCard key={i}
                                  title={mockdata.title!}
                                  exerciseTags={mockdata.exerciseTags!}
                                  finished={mockdata.finished}
                        //there are some optional properties
                        //check ExerciseCard
                    />
                );
            })}
        </>
    );
};

export default OverviewPage;