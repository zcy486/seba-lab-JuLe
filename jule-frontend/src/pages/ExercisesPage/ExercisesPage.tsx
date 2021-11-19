import React, {useEffect} from "react";
import styles from "./ExercisesPage.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import ExerciseCard from "../../components/ExerciseCard/ExerciseCard";
import ExerciseService from "../../services/ExerciseService";
import {Pagination} from "@mui/material";

const ExercisesPage = () => {

    //current page of the exercises
    const [page, setPage] = React.useState(1);
    //total count of the pages
    const [count, setCount] = React.useState(0);
    //exercises that display on the current page
    const [exercises, setExercises] = React.useState([]);

    useEffect(() => {
        (async () => {
            const pageCnt = await ExerciseService.getPageCount();
            setCount(pageCnt);
        })();
    }, []);

    useEffect(() => {
        let active = true;

        (async () => {
            const newData = await ExerciseService.getExercisesPerPage(page);
            if (!active) {
                return;
            }
            setExercises(newData);
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
            {exercises.map((mockdata: any, i) => {
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
            <div className={styles.pagination}>
                <Pagination count={count} page={page} onChange={handlePageChange}/>
            </div>
        </>
    );
};

export default ExercisesPage;
