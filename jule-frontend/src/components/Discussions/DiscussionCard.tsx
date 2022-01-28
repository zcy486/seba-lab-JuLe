import React, {useEffect, useState} from "react";
import {Avatar, Grid, Divider, Paper, Typography, Button, IconButton, ToggleButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Discussion from "../../models/Discussion";
import User from "../../models/User";
import DiscussionService from "../../services/DiscussionService";
import CommentCard from "./CommentCard";
import {Editor} from 'react-draft-wysiwyg';
import {EditorState, ContentState} from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

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
    const [editorState, setEditorState] = useState(() =>
        EditorState.createWithContent(ContentState.createFromText(''))
    )
    // states for adding new comment
    const [newComment, setNewComment] = useState<string>('')
    const [commentMode, setCommentMode] = useState<boolean>(false)
    const [newCommentState, setNewCommentState] = useState(() =>
        EditorState.createWithContent(ContentState.createFromText(''))
    )
    const [anonymous, setAnonymous] = useState<boolean>(false)
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
    }, [discussion.id])

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
        // set current discussion text as content of editor (input value)
        setEditorState(() =>
            EditorState.createWithContent(ContentState.createFromText(discussion.text)))
        setEditMode(true)
    }

    useEffect(() => {
        let currentText = editorState.getCurrentContent().getPlainText()
        setInput(currentText)
    }, [editorState])

    const handleCancelInput = () => {
        setEditMode(false)
    }

    const handleSaveInput = () => {
        if (!input) return

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

    useEffect(() => {
        let currentText = newCommentState.getCurrentContent().getPlainText()
        setNewComment(currentText)
    }, [newCommentState])

    const handleCancelComment = () => {
        setCommentMode(false)
    }

    const handleAddComment = () => {
        if (!newComment) return

        DiscussionService.addNewComment(discussion.id, newComment, anonymous)
            .then(res => {
                setDiscussion(res)
                setCommentMode(false)
                setNewCommentState(() =>
                    EditorState.createWithContent(ContentState.createFromText('')))
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
                {discussion.anonymous ?
                    (
                        <>
                            <Avatar sx={{width: 30, height: 30}} variant={'rounded'}/>
                            <Typography sx={{fontSize: 14}} variant={'overline'} color={'primary'}>
                                &nbsp;Anonymous
                            </Typography>
                        </>

                    ) : (
                        <>
                            {discussion.poster.role === 1 ?
                                <Avatar sx={{width: 30, height: 30, bgcolor: '#8bc34a'}}
                                        variant={'rounded'}>S</Avatar> :
                                <Avatar sx={{width: 30, height: 30, bgcolor: '#ffcd38'}} variant={'rounded'}>L</Avatar>
                            }
                            <Typography sx={{fontSize: 14}} variant={'overline'}
                                        color={'primary'}>&nbsp;{discussion.poster.name}</Typography>
                            <Typography
                                sx={{fontSize: 14}}>&nbsp;from&nbsp;{discussion.poster.university.name}</Typography>
                        </>
                    )
                }
            </Grid>
            <Divider/>
            <Grid container direction="column" pl={2}>
                <Grid container sx={{minHeight: 100}}>
                    {editMode ?
                        (
                            <>
                                <div style={{border: "1px solid black", padding: '2px', minHeight: '200px'}}>
                                    <Editor editorState={editorState} onEditorStateChange={setEditorState}/>
                                </div>
                                <Grid container mb={2} justifyContent="flex-end">
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
                                <div style={{border: "1px solid black", padding: '2px', minHeight: '200px'}}>
                                    <Editor editorState={newCommentState} onEditorStateChange={setNewCommentState}/>
                                </div>
                                <Grid container mb={2} justifyContent="flex-end">
                                    <Button size={"small"} onClick={handleCancelComment}>Cancel</Button>
                                    <ToggleButton size={'small'} value={'anonymous'} selected={anonymous}
                                                  onChange={() => setAnonymous(!anonymous)}>
                                        Anonymous
                                    </ToggleButton>
                                    <Button size={"small"} onClick={handleAddComment}>POST</Button>
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