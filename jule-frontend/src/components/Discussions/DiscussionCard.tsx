import React, {useState} from "react";
import {Avatar, Grid, Divider, Paper, Typography, Button, TextField, IconButton} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import Discussion from "../../models/Discussion";
import User from "../../models/User";
import DiscussionService from "../../services/DiscussionService";

interface Props {
    currentUser: User,
    discussion: Discussion,
}

const DiscussionCard = (props: Props) => {

    const [input, setInput] = useState<string>('')
    const [voted, setVoted] = useState<boolean>(false)
    const [editMode, setEditMode] = useState<boolean>(false)
    const [discussion, setDiscussion] = useState<Discussion>(props.discussion)

    const handleClickVote = () => {
        setVoted(!voted)
        //TODO: voting feature
    }

    const handleClickEdit = () => {
        // set current discussion text as input value
        setInput(discussion.text)
        setEditMode(true)
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }

    const handleClickCancel = () => {
        setEditMode(false)
    }

    const handleClickSave = () => {
        DiscussionService.updateDiscussionText(discussion.id, input)
            .then(res => {
                setDiscussion(res)
                setEditMode(false)
            })
    }

    const handleClickDelete = () => {
        DiscussionService.deleteDiscussion(discussion.id)
            .then(res => {
                window.location.reload()
            })
    }

    const handleClickNewComment = () => {
        //TODO: enable comments to the discussion
    }

    return (
        <Paper sx={{pt: 2, pb: 2, mb: 4, flexDirection: 'column'}} elevation={3}>
            <Grid container alignItems="center" pl={2}>
                {discussion.poster.role === 1 ?
                    <Avatar sx={{width: 30, height: 30, bgcolor: '#8bc34a'}} variant={'rounded'}>S</Avatar> :
                    <Avatar sx={{width: 30, height: 30, bgcolor: '#ffcd38'}} variant={'rounded'}>L</Avatar>
                }
                <Typography variant={'overline'}>
                    {discussion.poster.name} from {discussion.poster.university.name}
                </Typography>
            </Grid>
            <Divider/>
            <Grid container direction="column" pl={2}>
                <Grid container sx={{minHeight: 100}}>
                    {editMode ?
                        (
                            <>
                                <TextField
                                    fullWidth
                                    multiline
                                    maxRows={4}
                                    value={input}
                                    onChange={handleInput}
                                    size={"small"}
                                />
                                <Grid container justifyContent="flex-end">
                                    <Button size={"small"} onClick={handleClickCancel}>Cancel</Button>
                                    <Button size={"small"} onClick={handleClickSave}>Save</Button>
                                </Grid>
                            </>
                        ) : (
                            <Typography variant={'body1'}>{discussion.text}</Typography>
                        )
                    }
                </Grid>
                <Divider/>
                <Grid item>
                    <Button size={'small'}>Add a new comment</Button>
                </Grid>
            </Grid>
            <Divider/>
            <Grid container pl={2} pr={2} alignItems={'center'}>
                <Button size={'small'} onClick={handleClickVote}>{voted ? 'undo useful' : 'useful'}</Button>
                <Divider orientation="vertical" variant="middle" flexItem/>
                <Typography sx={{ml: '5px'}} variant={'caption'}>{discussion.votes}</Typography>
                {props.currentUser.id === discussion.poster.id &&
                    <>
                        <IconButton sx={{ml: 2}} onClick={handleClickEdit}>
                            <EditIcon sx={{fontSize: 18}}/>
                        </IconButton>
                        <IconButton onClick={handleClickDelete}>
                            <DeleteForeverIcon sx={{fontSize: 18}}/>
                        </IconButton>
                    </>
                }
                <Typography sx={{ml: 'auto'}} color={'gray'} variant={'body2'}>Created
                    at {discussion.creationTime}</Typography>
            </Grid>
        </Paper>
    )
}

export default DiscussionCard