import React, {useEffect, useState} from "react";
import {Box, Chip, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import TextEditor from "../components/TextEditor/TextEditor";
import TextEditorButtonPanel from "../components/TextEditorButtonPanel/TextEditorButtonPanel";
import ExerciseService from "../services/ExerciseService";
import Loading from "../components/Loading";
import CogOption from "../components/CogOption"; //TODO: make CogOption only visible to exercise's owner


const ExerciseDetailPage = () => {

    const {id} = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [explanation, setExplanation] = useState('');
    const [question, setQuestion] = useState('');
    const [solution, setSolution] = useState('');

    //indicator of loading state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            // fetch exercise details
            ExerciseService.getExercise(id)
                .then(resp => {
                    setTitle(resp.title)
                    setTags(resp.tags.map((tag) => tag.name))
                    setExplanation(resp.explanation)
                    setQuestion(resp.question)
                    setLoading(false)
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

    const onClickEdit = () => {
        // navigate to edit page
        if (id) navigate('edit')
    }

    const onClickDelete = () => {
        ExerciseService.deleteExercise(id!)
            .then(res => {
                console.log(res)
                navigate('/exercises')
            })
            .catch(err => console.log(err))
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

                        <Typography variant={'h6'} sx={{mt: 3}}>Your Task</Typography>
                        <Typography variant={'body1'}>{explanation}</Typography>

                        <Typography variant={'h6'} sx={{mt: 3}}>Question</Typography>
                        <Typography variant={'body1'}>{question}</Typography>

                        <Typography variant={'h6'} sx={{mt: 3}}>Your Solution</Typography>
                        <TextEditor text={solution} setText={(text) => setSolution(text)}/>

                        <TextEditorButtonPanel saveText={onSave} onCancel={onCancel}/>
                        <CogOption onClickEdit={onClickEdit} onClickDelete={onClickDelete} exerciseTitle={title}/>
                    </div>
                )
            }
        </div>
    )
};

export default ExerciseDetailPage;