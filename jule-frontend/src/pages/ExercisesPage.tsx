import React from "react";
import SearchBar from "../components/SearchBar/SearchBar";
import ExerciseCard from "../components/ExerciseCard/ExerciseCard";
import {mockExercises} from "../services/MockData";

const ExercisesPage = () => {
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

export default ExercisesPage;
