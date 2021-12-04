import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import ExerciseService from "../services/ExerciseService";
import TagService from "../services/TagService";
import Loading from "../components/Loading";
import {Alert, MenuItem, Select, TextField, Typography} from "@mui/material";
import TextEditor from "../components/TextEditor/TextEditor";
import TagInput from "../components/TagInput/TagInput";
import TextEditorButtonPanel from "../components/TextEditorButtonPanel/TextEditorButtonPanel";
import {SelectChangeEvent} from "@mui/material/Select";

const EditExercisePage = () => {

    const {id} = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState('');
    const [explanation, setExplanation] = useState('');
    const [question, setQuestion] = useState('');
    const [sampleSolution, setSampleSolution] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [difficulty, setDifficulty] = useState('');
    const [scope, setScope] = useState('');

    const [loading, setLoading] = useState(true); // indicator of loading state
    const [error, setError] = useState('');
    const [options, setOptions] = useState<string[]>([]); // tag options

    useEffect(() => {
        // get all available tags from backend as options
        (async () => {
            const all_tags = await TagService.getAll()
            if (!all_tags) return
            setOptions(all_tags.map((tag) => tag.name))
        })();
    }, [])

    useEffect(() => {
        if (id) {
            // reload current states of the exercise to be updated
            ExerciseService.getExercise(id)
                .then(resp => {
                    setTitle(resp.title)
                    setExplanation(resp.explanation)
                    setQuestion(resp.question)
                    setSampleSolution(resp.sampleSolution)
                    setTags(resp.tags.map((tag) => tag.name))
                    setDifficulty(resp.difficulty.toString())
                    setScope(resp.scope.toString())
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

    const onChangeTitle = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitle(e.target.value)
        setError('')
    }

    const onChangeExplanation = (new_text: string) => {
        setExplanation(new_text)
        setError('')
    }

    const onChangeQuestion = (new_text: string) => {
        setQuestion(new_text)
        setError('')
    }

    const onChangeSampleSolution = (new_text: string) => {
        setSampleSolution(new_text)
        setError('')
    }

    const onChangeTags = (e: any, new_tags: string[]) => {
        setTags(new_tags)
        setError('')
    }

    const onChangeDifficulty = (e: SelectChangeEvent) => {
        setDifficulty(e.target.value);
        setError('')
    }

    const onChangeScope = (e: SelectChangeEvent) => {
        setScope(e.target.value);
        setError('')
    }

    const onSave = () => {
        if (!title) {
            setError('Field Title must not be empty.')
            return;
        }
        if (!explanation) {
            setError('Field Explanation must not be empty.')
            return;
        }
        if (!question) {
            setError('Field Question must not be empty.')
            return;
        }
        if (!sampleSolution) {
            setError('Field Sample Solution must not be empty.')
            return;
        }
        if (!difficulty) {
            setError('Field Difficulty must not be empty.')
            return;
        }
        if (!scope) {
            setError('Field Scope must not be empty.')
            return;
        }
        // if above fields are not empty
        let updated = new FormData()
        updated.append('title', title)
        updated.append('explanation', explanation)
        updated.append('question', question)
        updated.append('sample_solution', sampleSolution)
        updated.append('difficulty', difficulty)
        updated.append('scope', scope)
        updated.append('tags', JSON.stringify(tags))

        ExerciseService.updateExercise(id!, updated)
            .then((res) => {
                console.log('Successfully updated')
                console.log(res)
                //TODO: navigate to profile page or exercise detail page?
                navigate(`/exercises/${id}`)
            })
            .catch(err => {
                if (err.status === 409) {
                    setError('Exercise with same title already exists.')
                } else {
                    setError('Unknown error.')
                }
            })
    }

    const onCancel = () => {
        if (id) navigate(`/exercises/${id}`)
    }

    return (
        <div>
            {loading ?
                (
                    <Loading/>
                ) :
                (
                    <div>
                        <h1>Edit The Exercise</h1>
                        <Typography variant={'h6'}>Title<span style={{color: 'red'}}>*</span></Typography>
                        <TextField
                            fullWidth
                            value={title}
                            onChange={onChangeTitle}
                        />
                        <Typography variant={'h6'} sx={{mt: 3}}>Explanation<span
                            style={{color: 'red'}}>*</span></Typography>
                        <TextEditor text={explanation} setText={onChangeExplanation}/>
                        <Typography variant={'h6'} sx={{mt: 3}}>Question<span
                            style={{color: 'red'}}>*</span></Typography>
                        <TextEditor text={question} setText={onChangeQuestion}/>
                        <Typography variant={'h6'} sx={{mt: 3}}>Sample Solution<span
                            style={{color: 'red'}}>*</span></Typography>
                        <TextEditor text={sampleSolution} setText={onChangeSampleSolution}/>
                        <Typography variant={'h6'} sx={{mt: 3}}>Tags (optional)</Typography>
                        <TagInput tags={tags} onChange={onChangeTags} options={options}/>
                        <Typography variant={'h6'} sx={{mt: 3}}>Difficulty<span
                            style={{color: 'red'}}>*</span></Typography>
                        <Select value={difficulty} onChange={onChangeDifficulty} sx={{minWidth: 160}}>
                            <MenuItem value={1}>Easy</MenuItem>
                            <MenuItem value={2}>Medium</MenuItem>
                            <MenuItem value={3}>Hard</MenuItem>
                        </Select>
                        <Typography variant={'h6'} sx={{mt: 3}}>Scope<span style={{color: 'red'}}>*</span></Typography>
                        <Select value={scope} onChange={onChangeScope} sx={{minWidth: 160}}>
                            <MenuItem value={1}>Draft</MenuItem>
                            <MenuItem value={2}>Internal</MenuItem>
                            <MenuItem value={3}>Public</MenuItem>
                        </Select>

                        {error && <Alert sx={{mt: 3}} severity="error">{error}</Alert>}
                        <TextEditorButtonPanel saveText={onSave} onCancel={onCancel}/>
                    </div>
                )
            }
        </div>
    )
};

export default EditExercisePage;