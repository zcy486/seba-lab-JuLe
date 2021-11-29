import React, {useState, useEffect} from "react";
import {MenuItem, Select, TextField, Typography} from "@mui/material";
import {SelectChangeEvent} from "@mui/material/Select";
import TextEditor from "../components/TextEditor/TextEditor";
import TagInput from "../components/TagInput/TagInput";
import TextEditorButtonPanel from "../components/TextEditorButtonPanel/TextEditorButtonPanel";
import ExerciseService from "../services/ExerciseService";
import TagService from "../services/TagService";

const NewExercisePage = () => {

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
            const tag_options = await TagService.getAll()
            if (!tag_options) return
            setOptions(tag_options.map((tag) => tag.name))
        })();
    }, [])

    const handleChangeTitle = (e: { target: { value: React.SetStateAction<string>; }; }) => {
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

    const handleSubmit = () => {
        if (!title) {
            setError('Field title must not be empty.')
            return;
        }
        if (!explanation) {
            setError('Field explanation must not be empty.')
            return;
        }
        if (!question) {
            setError('Field question must not be empty.')
            return;
        }
        if (!difficulty) {
            setError('Field difficulty must not be empty.')
            return;
        }
        if (!scope) {
            setError('Field scope must not be empty.')
            return;
        }
        // if above fields are not empty
        let new_exercise = new FormData()
        new_exercise.append('title', title)
        new_exercise.append('explanation', explanation)
        new_exercise.append('question', question)
        new_exercise.append('sample_solution', solution)
        new_exercise.append('difficulty', difficulty)
        new_exercise.append('scope', scope)
        new_exercise.append('tags', JSON.stringify(tags))

        // specify the exercise's owner_id
        // TODO: replace fake_id with the lecturer's id
        let fake_id = '123'
        new_exercise.append('owner_id', fake_id)

        ExerciseService.createExercise(new_exercise).then((res) => {
            if (res.status === 200) {
                console.log('Successfully created')
                //TODO: navigate to profile page (lecturer's view)
            } else if (res.status === 409) {
                setError('Exercise with same title already exists.')
            } else if (res.status === 405) {
                setError('User not exists.')
            } else {
                console.log(res)
                setError('Unknown error')
            }
        })
    }

    const handleCancel = () => {
        // TODO: navigate to profile page (lecturer's view)
    }

    return (
        <div>
            <h1>Create New Exercise</h1>

            <Typography variant={'h6'}>Title</Typography>
            <TextField
                fullWidth
                value={title}
                onChange={handleChangeTitle}
            />

            <Typography variant={'h6'} sx={{mt: 3}}>Explanation</Typography>
            <TextEditor text={explanation} setText={handleChangeExplanation}/>

            <Typography variant={'h6'} sx={{mt: 3}}>Question</Typography>
            <TextEditor text={question} setText={handleChangeQuestion}/>

            <Typography variant={'h6'} sx={{mt: 3}}>Sample Solution</Typography>
            <TextEditor text={solution} setText={handleChangeSolution}/>

            <Typography variant={'h6'} sx={{mt: 3}}>Tags</Typography>
            <TagInput tags={tags} onChange={handleChangeTags} options={options}/>

            <Typography variant={'h6'} sx={{mt: 3}}>Difficulty</Typography>
            <Select value={difficulty} onChange={handleChangeDifficulty} sx={{minWidth: 160}}>
                <MenuItem value={1}>Easy</MenuItem>
                <MenuItem value={2}>Medium</MenuItem>
                <MenuItem value={3}>Hard</MenuItem>
            </Select>

            <Typography variant={'h6'} sx={{mt: 3}}>Scope</Typography>
            <Select value={scope} onChange={handleChangeScope} sx={{minWidth: 160}}>
                <MenuItem value={1}>Draft</MenuItem>
                <MenuItem value={2}>Internal</MenuItem>
                <MenuItem value={3}>Public</MenuItem>
            </Select>

            <Typography color={'error'} sx={{mt: 3}}>{error}</Typography>
            <TextEditorButtonPanel saveText={handleSubmit} onCancel={handleCancel}/>
        </div>
    )
};

export default NewExercisePage;