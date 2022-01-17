import React, {useEffect, useState} from "react";
import {Avatar, Grid, Divider, Paper, Typography, Button, TextField, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Discussion from "../../models/Discussion";
import User from "../../models/User";
import DiscussionService from "../../services/DiscussionService";
import CommentCard from "./CommentCard";

interface Props {
    currentUser: User,
    discussion: Discussion,
}

const DiscussionCard = (props: Props) => {
    // states for voting discussion
    const [voted, setVoted] = useState<boolean>(false)
    const [disableVote, setDisableVote] = useState<boolean>(true)
    // states for editing discussion
    const [input, setInput] = useState<string>('')
    const [editMode, setEditMode] = useState<boolean>(false)
    // states for adding new comment
    const [newComment, setNewComment] = useState<string>('')
    const [commentMode, setCommentMode] = useState<boolean>(false)
    // the discussion to be rendered
    const [discussion, setDiscussion] = useState<Discussion>(props.discussion)

    useEffect(() => {
        // check if user has already voted the discussion
        // and set voted in advance
        DiscussionService.fetchDiscussionVoted(discussion.id)
            .then(res => {
                setVoted(res)
                setDisableVote(false)
            })
    }, [])

    // ====handlers for voting discussion====
    const handleVoteDiscussion = () => {
        DiscussionService.voteDiscussion(discussion.id)
            .then(res => {
                setDiscussion(res)
                setVoted(!voted)
            })
    }

    // ====handlers for editing discussion====
    const handleEditDiscussion = () => {
        // set current discussion text as input value
        setInput(discussion.text)
        setEditMode(true)
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }

    const handleCancelInput = () => {
        setEditMode(false)
    }

    const handleSaveInput = () => {
        DiscussionService.updateDiscussionText(discussion.id, input)
            .then(res => {
                setDiscussion(res)
                setEditMode(false)
            })
    }

    // ====handlers for deleting discussion====
    const handleDeleteDiscussion = () => {
        DiscussionService.deleteDiscussion(discussion.id)
            .then(res => {
                window.location.reload()
            })
    }

    // ====handlers for adding new comment====
    const handleClickNewComment = () => {
        setCommentMode(true)
    }

    const handleInputComment = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(e.target.value)
    }

    const handleCancelComment = () => {
        setCommentMode(false)
    }

    const handleAddComment = () => {
        DiscussionService.addNewComment(discussion.id, newComment)
            .then(res => {
                setDiscussion(res)
                setCommentMode(false)
                setNewComment('')
            })
    }

    // ====handlers for voting and deleting comment====
    const handleVoteComment = async (commentId: number) => {
        const res = await DiscussionService.voteComment(discussion.id, commentId)
        setDiscussion(res)
    }

    const handleDeleteComment = (commentId: number) => {
        DiscussionService.deleteComment(discussion.id, commentId)
            .then(res => {
                setDiscussion(res)
            })
    }

    return (
        <Paper sx={{pt: 2, pb: 2, mb: 4, flexDirection: 'column'}} elevation={3}>
            <Grid container alignItems="center" pl={2}>
                {discussion.poster.role === 1 ?
                    <Avatar sx={{width: 30, height: 30, bgcolor: '#8bc34a'}} variant={'rounded'}>S</Avatar> :
                    <Avatar sx={{width: 30, height: 30, bgcolor: '#ffcd38'}} variant={'rounded'}>L</Avatar>
                }
                <Typography sx={{fontSize: 14}} variant={'overline'}
                            color={'primary'}>{discussion.poster.name}</Typography>
                <Typography sx={{fontSize: 14}}>&nbsp;from&nbsp;{discussion.poster.university.name}</Typography>
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
                                    <Button size={"small"} onClick={handleCancelInput}>Cancel</Button>
                                    <Button size={"small"} onClick={handleSaveInput}>Save</Button>
                                </Grid>
                            </>
                        ) : (
                            <Typography style={{overflowWrap: "break-word"}}
                                        variant={'body1'}>{discussion.text}</Typography>
                        )
                    }
                </Grid>
                {discussion.comments.map(comment => {
                    return <CommentCard
                        key={comment.id}
                        comment={comment}
                        currentUser={props.currentUser}
                        discussionId={discussion.id}
                        handleVoteComment={handleVoteComment}
                        handleDeleteComment={handleDeleteComment}
                    />
                })}
                <Divider/>
                <Grid container>
                    {commentMode ?
                        (
                            <>
                                <TextField
                                    fullWidth
                                    multiline
                                    maxRows={4}
                                    value={newComment}
                                    onChange={handleInputComment}
                                    size={"small"}
                                    placeholder={"Add a new comment here..."}
                                />
                                <Grid container justifyContent="flex-end">
                                    <Button size={"small"} onClick={handleCancelComment}>Cancel</Button>
                                    <Button size={"small"} onClick={handleAddComment}>Add</Button>
                                </Grid>
                            </>
                        ) : (
                            <Button size={'small'} onClick={handleClickNewComment}>Add a new comment</Button>
                        )
                    }
                </Grid>
            </Grid>
            <Divider/>
            <Grid container pl={2} pr={2} alignItems={'center'}>
                <Button size={'small'} disabled={disableVote}
                        onClick={handleVoteDiscussion}>{voted ? 'undo useful' : 'useful'}</Button>
                <Divider orientation="vertical" variant="middle" flexItem/>
                <Typography sx={{ml: '5px'}} variant={'caption'}>{discussion.votes}</Typography>
                {props.currentUser.id === discussion.poster.id &&
                    <>
                        <IconButton sx={{ml: 2}} onClick={handleEditDiscussion}>
                            <EditIcon sx={{fontSize: 18}}/>
                        </IconButton>
                        <IconButton onClick={handleDeleteDiscussion}>
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