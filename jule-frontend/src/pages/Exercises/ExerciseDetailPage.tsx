import React, {useEffect, useState} from "react";
import {Box, Chip, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import TextEditor from "../../components/TextEditor/TextEditor";
import TextEditorButtonPanel from "../../components/TextEditorButtonPanel/TextEditorButtonPanel";
import ExerciseService from "../../services/ExerciseService";
import UserService from "../../services/UserService";
import Loading from "../../components/Loading";
import CogOption from "../../components/CogOption";
import User from "../../models/User";
import SubmissionService from "../../services/SubmissionService";


const ExerciseDetailPage = () => {

    const {id} = useParams()
    const navigate = useNavigate()

    const [user, setUser] = useState<User>(); // current logged-in user
    const [ownerId, setOwnerId] = useState<number>();
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [explanation, setExplanation] = useState('');
    const [question, setQuestion] = useState('');
    const [solution, setSolution] = useState('');

    //indicator of loading state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        UserService.getCurrentUser().then(val => setUser(val));
    }, [])

    useEffect(() => {
        if (id) {
            // fetch exercise details
            ExerciseService.getExercise(id)
                .then(resp => {
                    setOwnerId(resp.owner.id)
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
                    } else if (err.status === 401) {
                        alert('You are not authorized to view this exercise!')
                    } else {
                        alert('Unknown error.')
                    }
                });
        }
    }, [id]);

    const onCancel = () => {
        navigate('/exercises')
    }

    const onSave = () => {
        if(id) {
            let submission = {text: solution}
            SubmissionService.createSubmission('2', id, submission).then(
            ).catch(err => {
                if (err.status === 405) {
                    alert('Something went wrong, we could not save your submission!')
                } else if (err.status === 401) {
                    alert('You are not authorized to view this exercise!')
                } else {
                    alert('Unknown error.')
                }
            });
            navigate(`/exercises/${id}/results`)
        }
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
            .catch(err => {
                if (err.status === 401) {
                    alert('You are not authorized to delete this exercise!')
                } else {
                    alert('Unknown error!')
                }
            })
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
                        {user && ownerId && user.id === ownerId && //make cog option only visible to the owner
                            <CogOption onClickEdit={onClickEdit} onClickDelete={onClickDelete} exerciseTitle={title}/>
                        }
                    </div>
                )
            }
        </div>
    )
};

export default ExerciseDetailPage;
