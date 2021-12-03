import React, {useEffect, useState} from "react";
import {Box, Chip, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import TextEditor from "../components/TextEditor/TextEditor";
import TextEditorButtonPanel from "../components/TextEditorButtonPanel/TextEditorButtonPanel";
import ExerciseService from "../services/ExerciseService";


const ExerciseDetailPage = () => {

    const {id} = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [explanation, setExplanation] = useState('');
    const [question, setQuestion] = useState('');
    const [solution, setSolution] = useState('');

    useEffect(() => {
        if (id) {
            ExerciseService.getExercise(id)
                .then(resp => {
                    setTitle(resp.title)
                    setTags(resp.tags && resp.tags.map((tag) => tag.name))
                    setExplanation(resp.explanation)
                    setQuestion(resp.question)
                })
                .catch(err => {
                    if (err.status === 405) {
                        // TODO: report error in a standard way
                        alert('No exercise found with matching id!')
                    }
                });
        }
    }, [id]);

    const onCancel = () => {
        navigate('/exercises')
    }

    const onSave = () => {
        // TODO: add service for submission and navigate to exercise result page!
    }

    return (
        <div>
            <h1>{title}</h1>
            <Box sx={{display: 'flex'}}>
                {tags && tags.map((tag) => <Chip key={tag} label={tag} sx={{mr:1}}/>)}
            </Box>

            <Typography variant={'h6'} sx={{mt: 3}}>Your Task</Typography>
            <Typography variant={'body1'}>{explanation}</Typography>

            <Typography variant={'h6'} sx={{mt: 3}}>Question</Typography>
            <Typography variant={'body1'}>{question}</Typography>

            <Typography variant={'h6'} sx={{mt: 3}}>Your Solution</Typography>
            <TextEditor text={solution} setText={(text) => setSolution(text)}/>

            <TextEditorButtonPanel saveText={onSave} onCancel={onCancel}/>
        </div>
    )
};

export default ExerciseDetailPage;