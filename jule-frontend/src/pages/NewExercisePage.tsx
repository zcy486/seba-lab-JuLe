import React, {useState} from "react";
import {MenuItem, Select, TextField, Typography} from "@mui/material";
import {SelectChangeEvent} from "@mui/material/Select";
import TextEditor from "../components/TextEditor/TextEditor";
import TagInput from "../components/TagInput/TagInput";
import TextEditorButtonPanel from "../components/TextEditorButtonPanel/TextEditorButtonPanel";

const NewExercisePage = () => {

    const options = ['tag1', 'tag2', 'tag3']; // TODO:

    const [title, setTitle] = useState('');
    const [explanation, setExplanation] = useState('');
    const [question, setQuestion] = useState('');
    const [solution, setSolution] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [difficulty, setDifficulty] = useState('');
    const [scope, setScope] = useState('');
    const [error, setError] = useState('');

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
        // TODO: send request to backend
    }

    const handleCancel = () => {
        // TODO: go back to profile page
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