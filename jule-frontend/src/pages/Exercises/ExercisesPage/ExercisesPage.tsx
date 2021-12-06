import React, {useState, useEffect} from "react";
import styles from "./ExercisesPage.module.css";
import {Pagination, Typography} from "@mui/material";
import {SelectChangeEvent} from "@mui/material/Select";
import SearchBar from "../../../components/SearchBar/SearchBar";
import ExerciseCard from "../../../components/ExerciseCard/ExerciseCard";
import ExerciseService from "../../../services/ExerciseService";
import TagService from "../../../services/TagService";
import Exercise from "../../../models/Exercise";
import Tag from "../../../models/Tag";
import Loading from "../../../components/Loading";

const ExercisesPage = () => {

    //current page of the exercises
    const [page, setPage] = useState(1);
    //total page number
    const [pages, setPages] = useState(1);
    //exercises to be displayed on the current page
    const [exercises, setExercises] = useState<Exercise[]>([]);
    //available tags to be displayed on the search bar
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);

    //filters-relevant states
    //difficulty in filters
    const [difficulty, setDifficulty] = useState('');
    //selected tags in filters
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    //input of search box
    const [input, setInput] = useState('');
    //current searching content used in filters
    const [searchContent, setSearchContent] = useState('');
    //indicator of loading state
    const [loading, setLoading] = useState(true);

    // get all available tags from backend
    useEffect(() => {
        TagService.getAll()
            .then(res => {
                setAvailableTags(res)
            });
    }, [])

    // get exercises and total pages after changing the filters or searching
    useEffect(() => {
        let active = true;
        (async () => {
            let filters = {
                difficulty: difficulty,
                tags: selectedTags,
                search: searchContent,
            }
            const resp = await ExerciseService.applyFilters(filters)
            if (!active) {
                return;
            }
            setExercises(resp.exercises)
            setPages(resp.pages)
            // always redirect to the first page after changing the filters
            setPage(1)
            setLoading(false)
        })();
        // cleanup function
        return () => {
            active = false;
        };
    }, [difficulty, selectedTags, searchContent]);

    const onChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        if (value !== page) {
            setPage(value);
            setLoading(true);
            setInput(searchContent);
            let filters = {
                difficulty: difficulty,
                tags: selectedTags,
                search: searchContent,
            }
            //get exercises to be displayed on the new page by current filters
            ExerciseService.getExercisesPerPage(value, filters)
                .then(resp => {
                    setExercises(resp)
                    setLoading(false)
                })
        }
    };

    const onChangeDifficulty = (event: SelectChangeEvent) => {
        setDifficulty(event.target.value);
        setLoading(true)
    }

    const onChangeSelectedTags = (event: SelectChangeEvent<string[]>) => {
        const {target: {value}} = event
        setSelectedTags(
            typeof value === 'string' ? value.split(',') : value,
        );
        setLoading(true)
    };

    const handleChangeInput = (event: any) => {
        setInput(event.target.value)
    };

    const onSearch = () => {
        setSearchContent(input);
        setLoading(true)
    };

    return (
        <div>
            <h1>Available Exercises</h1>
            <SearchBar
                difficulty={difficulty}
                onChangeDifficulty={onChangeDifficulty}
                selectedTags={selectedTags}
                onChangeSelectedTags={onChangeSelectedTags}
                availableTags={availableTags}
                input={input}
                onChangeInput={handleChangeInput}
                onSearch={onSearch}
            />
            {searchContent && <Typography>Search results with "{searchContent}"</Typography>}
            {loading ?
                (
                    <Loading/>
                ) :
                (
                    <div>
                        {exercises.map((exercise: Exercise, i) => {
                            return (
                                <ExerciseCard
                                    key={i}
                                    id={exercise.id}
                                    title={exercise.title}
                                    exerciseTags={exercise.tags.map((tag) => tag.name)}
                                    //there are some optional properties
                                    //check ExerciseCard
                                />
                            );
                        })}
                        <div className={styles.pagination}>
                            <Pagination count={pages} page={page} onChange={onChangePage}/>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default ExercisesPage;
