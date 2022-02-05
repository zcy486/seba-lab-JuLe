import React, {useState, useEffect} from "react";
import {Alert, MenuItem, Select, TextField, Typography} from "@mui/material";
import {SelectChangeEvent} from "@mui/material/Select";
import TextEditor from "../../components/TextEditor/TextEditor";
import TagInput from "../../components/TagInput/TagInput";
import TextEditorButtonPanel from "../../components/TextEditorButtonPanel/TextEditorButtonPanel";
import ExerciseService from "../../services/ExerciseService";
import TagService from "../../services/TagService";
import {useNavigate} from "react-router-dom";

const NewExercisePage = () => {

    const navigate = useNavigate()

    const [title, setTitle] = useState('');
    const [explanation, setExplanation] = useState('');
    const [question, setQuestion] = useState('');
    const [solution, setSolution] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [difficulty, setDifficulty] = useState('');
    const [scope, setScope] = useState('');
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

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
        setError('')
    }

    const handleChangeExplanation = (new_text: string) => {
        setExplanation(new_text)
        setError('')
    }

    const handleChangeQuestion = (new_text: string) => {
        setQuestion(new_text)
        setError('')
    }

    const handleChangeSolution = (new_text: string) => {
        setSolution(new_text)
        setError('')
    }

    const handleChangeTags = (e: any, new_tags: string[]) => {
        setTags(new_tags)
        setError('')
    }

    const handleChangeDifficulty = (e: SelectChangeEvent) => {
        setDifficulty(e.target.value);
        setError('')
    }

    const handleChangeScope = (e: SelectChangeEvent) => {
        setScope(e.target.value);
        setError('')
    }

    const handleSubmit = async () => {
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
        if (!solution) {
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
        let new_exercise: any = {}
        new_exercise.title = title
        new_exercise.explanation = explanation
        new_exercise.question = question
        new_exercise.sampleSolution = solution
        new_exercise.difficulty = difficulty
        new_exercise.scope = scope
        new_exercise.tags = tags

        ExerciseService.createExercise(JSON.stringify(new_exercise))
            .then((res) => {
                console.log('Successfully created')
                console.log(res);
                // navigate to exercise detail page
                navigate(`/exercises/${res.id}`)
            })
            .catch(err => {
                if (err.status === 409) {
                    setError('Exercise with same title already exists.')
                } else {
                    setError('Unknown error.')
                }
            });
    }

    const handleCancel = () => {
        navigate('/profile')
    }

    return (
        <div>
            <h1>Create New Exercise</h1>

            <Typography variant={'h6'}>Title<span style={{color: 'red'}}>*</span></Typography>
            <TextField
                fullWidth
                value={title}
                onChange={handleChangeTitle}
            />

            <Typography variant={'h6'} sx={{mt: 3}}>Explanation<span style={{color: 'red'}}>*</span></Typography>
            <TextEditor text={explanation} setText={handleChangeExplanation}/>

            <Typography variant={'h6'} sx={{mt: 3}}>Question<span style={{color: 'red'}}>*</span></Typography>
            <TextEditor text={question} setText={handleChangeQuestion}/>

            <Typography variant={'h6'} sx={{mt: 3}}>Sample Solution<span style={{color: 'red'}}>*</span></Typography>
            <TextEditor text={solution} setText={handleChangeSolution}/>

            <Typography variant={'h6'} sx={{mt: 3}}>Tags (optional)</Typography>
            <TagInput tags={tags} onChange={handleChangeTags} options={options}/>

            <Typography variant={'h6'} sx={{mt: 3}}>Difficulty<span style={{color: 'red'}}>*</span></Typography>
            <Select value={difficulty} onChange={handleChangeDifficulty} sx={{minWidth: 160}}>
                <MenuItem value={1}>Easy</MenuItem>
                <MenuItem value={2}>Medium</MenuItem>
                <MenuItem value={3}>Hard</MenuItem>
            </Select>

            <Typography variant={'h6'} sx={{mt: 3}}>Scope<span style={{color: 'red'}}>*</span></Typography>
            <Select value={scope} onChange={handleChangeScope} sx={{minWidth: 160}}>
                <MenuItem value={1}>Draft</MenuItem>
                <MenuItem value={2}>Internal</MenuItem>
                <MenuItem value={3}>Public</MenuItem>
            </Select>

            {error && <Alert sx={{mt: 3}} severity="error">{error}</Alert>}
            <TextEditorButtonPanel saveText={handleSubmit} onCancel={handleCancel}/>
        </div>
    )
};

export default NewExercisePage;
