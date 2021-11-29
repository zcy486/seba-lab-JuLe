import React, {useState, useEffect} from "react";
import styles from "./ExercisesPage.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import ExerciseCard from "../../components/ExerciseCard/ExerciseCard";
import ExerciseService from "../../services/ExerciseService";
import {Pagination} from "@mui/material";

const ExercisesPage = () => {

    //current page of the exercises
    const [page, setPage] = useState(1);
    //total page number
    const [pages, setPages] = useState(1);
    //exercises to be displayed on the current page
    const [exercises, setExercises] = React.useState([]);

    // get total pages after changing the filters
    useEffect(() => {
        // TODO: pass filter values to the backend
        (async () => {
            const total_pages = await ExerciseService.getPages()
            setPages(total_pages)
            // redirect to the first page after changing the filters
            setPage(1)
        })();
    }, []); // TODO: dependencies should be all values in filters

    // get exercises to be displayed on the current page
    useEffect(() => {
        let active = true;

        (async () => {
            const data = await ExerciseService.getExercisesPerPage(page);
            if (!active) {
                return;
            }
            setExercises(data)
        })();

        return () => {
            active = false;
        };
    }, [page]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <>
            <h1>Available Exercises</h1>
            <SearchBar/>
            {exercises.map((exercise: any, i) => {
                return (
                    <ExerciseCard key={i}
                                  title={exercise.title}
                                  exerciseTags={exercise.tags && exercise.tags.map((tag: any) => tag.name)}
                        //there are some optional properties
                        //check ExerciseCard
                    />
                );
            })}
            <div className={styles.pagination}>
                <Pagination count={pages} page={page} onChange={handlePageChange}/>
            </div>
        </>
    );
};

export default ExercisesPage;
