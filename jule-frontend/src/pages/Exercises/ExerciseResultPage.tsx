import React, {useEffect, useState} from "react";
import {Box, Chip, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import ExerciseService from "../../services/ExerciseService";
import UserService from "../../services/UserService";
import StatisticsService from "../../services/StatisticsService";
import SubmissionService from "../../services/SubmissionService";
import Loading from "../../components/Loading";
import User from "../../models/User";
import Button from "@mui/material/Button";
import Statistics from "../../models/Statistics";
import ScoreList from "../../components/ScoreList/ScoreList";
import ScoreListLegend from "../../components/ScoreListLegend/ScoreListLegend";


const ExerciseResultPage = () => {

    const {id} = useParams()
    const navigate = useNavigate()

    const [user, setUser] = useState<User>(); // current logged-in user
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [solution, setSolution] = useState<string>();
    const [submission, setSubmission] = useState<string>();
    const [results, setResults] = useState<Statistics>();


    //indicator of loading state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        UserService.getCurrentUser().then(val => setUser(val));
    }, [])

    useEffect(() => {
        if (id) {
            StatisticsService.getStatistics('2', id).then(val => setResults(val));
        }
    }, [])

    useEffect(() => {
        if (id) {
            SubmissionService.getSubmission('2', id).then(val => setSubmission(val.text));
        }
    }, [])

    useEffect(() => {
        if (id) {
            // fetch exercise details
            ExerciseService.getExercise(id)
                .then(resp => {
                    setTitle(resp.title)
                    setTags(resp.tags.map((tag) => tag.name))
                    setSolution(resp.sampleSolution)
                    setLoading(false)
                })
                .catch(err => {
                    if (err.status === 405) {
                        // TODO: report error in a standard way
                        alert('No exercise found with matching id!')
                    } else if (err.status === 401) {
                        alert('You are not authorized to view this exercise!')
                    } else {
                        alert('Unknown error.')
                    }
                });
        }
    }, [id]);

    const onEdit = () => {
        navigate(`/exercises/${id}`)
    }

    return (
        <div>
            {loading ?
                (
                    <Loading/>
                ) :
                (
                    <div>
                        <h1>{title}</h1>
                        <Box sx={{display: 'flex'}}>
                            {tags && tags.map((tag) => <Chip key={tag} label={tag} sx={{mr: 1}}/>)}
                        </Box>

                        <Typography variant={'h5'} sx={{mt: 3}}>Your Results</Typography>
                        <ScoreListLegend/>

                        {results ? (<ScoreList stats={results}/>) : (<></>)}

                        <Typography variant={'h5'} sx={{mt: 3}}>The Sample Solution</Typography>
                        <Typography variant={'body1'}>{solution}</Typography>

                        <Typography variant={'h5'} sx={{mt: 3}}>Your Solution</Typography>
                        <Typography variant={'body1'}>{submission}</Typography>

                        <Button className="text-editor-button" variant="contained" onClick={onEdit} >Edit Submission</Button>

                    </div>
                )
            }
        </div>
    )
};

export default ExerciseResultPage;
