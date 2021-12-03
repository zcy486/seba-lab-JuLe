import React, {useState, useEffect} from "react";
import styles from "./ExercisesPage.module.css";
import {Pagination} from "@mui/material";
import SearchBar from "../../components/SearchBar/SearchBar";
import ExerciseCard from "../../components/ExerciseCard/ExerciseCard";
import ExerciseService from "../../services/ExerciseService";
import TagService from "../../services/TagService";
import Exercise from "../../models/Exercise";
import {SelectChangeEvent} from "@mui/material/Select";

const ExercisesPage = () => {

    //current page of the exercises
    const [page, setPage] = useState(1);
    //total page number
    const [pages, setPages] = useState(1);
    //exercises to be displayed on the current page
    const [exercises, setExercises] = useState<Exercise[]>([]);
    //available tags to be displayed on the search bar
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    //filters-relevant states
    //difficulty in filters
    const [difficulty, setDifficulty] = useState('');
    //selected tags in filters
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    //input of search box
    const [input, setInput] = useState('');

    // get all available tags from backend
    useEffect(() => {
        (async () => {
            const all_tags = await TagService.getAll()
            if (!all_tags) return
            setAvailableTags(all_tags.map((tag) => tag.name))
        })();
    }, [])

    // get exercises and total pages after changing the filters
    useEffect(() => {
        let active = true;
        (async () => {
            let filters = new FormData()
            filters.append('difficulty', difficulty)
            filters.append('tags', JSON.stringify(selectedTags))
            const resp = await ExerciseService.applyFilters(filters)
            if (!active) {
                return;
            }
            setExercises(resp.exercises)
            setPages(resp.pages)
            // always redirect to the first page after changing the filters
            setPage(1)
        })();
        return () => {
            active = false;
        };
    }, [difficulty, selectedTags]);

    // get exercises to be displayed on the current page
    useEffect(() => {
        let active = true;
        (async () => {
            let filters = new FormData()
            filters.append('difficulty', difficulty)
            filters.append('tags', JSON.stringify(selectedTags))
            const exercisesPerPage = await ExerciseService.getExercisesPerPage(page, filters)
            if (!active) {
                return;
            }
            setExercises(exercisesPerPage)
        })();
        return () => {
            active = false;
        };
    }, [page]);

    const onChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const onChangeDifficulty = (event: SelectChangeEvent) => {
        setDifficulty(event.target.value);
    }

    const onChangeSelectedTags = (event: SelectChangeEvent<string[]>) => {
        const {target: {value}} = event
        setSelectedTags(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleChangeInput = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setInput(event.target.value)
    };

    const onSearch = () => {
        if (input) {
            // TODO: add exercise service for searching
            console.log("Search with:", input);
        }
    };

    return (
        <>
            <h1>Available Exercises</h1>
            <SearchBar
                difficulty={difficulty}
                onChangeDifficulty={onChangeDifficulty}
                selectedTags={selectedTags}
                onChangeSelectedTags={onChangeSelectedTags}
                tagsInUse={availableTags}
                input={input}
                onChangeInput={handleChangeInput}
                onSearch={onSearch}
            />
            {exercises && exercises.map((exercise: Exercise, i) => {
                return (
                    <ExerciseCard
                        key={i}
                        id={exercise.id}
                        title={exercise.title}
                        exerciseTags={exercise.tags && exercise.tags.map((tag) => tag.name)}
                        //there are some optional properties
                        //check ExerciseCard
                    />
                );
            })}
            <div className={styles.pagination}>
                <Pagination count={pages} page={page} onChange={onChangePage}/>
            </div>
        </>
    );
};

export default ExercisesPage;
