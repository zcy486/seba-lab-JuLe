import React, {useEffect, useState} from "react";
import {Avatar, Divider, Grid, IconButton, Typography} from "@mui/material";
import Comment from "../../models/Comment";
import User from "../../models/User";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DiscussionService from "../../services/DiscussionService";

interface Props {
    comment: Comment
    currentUser: User
    discussionId: number
    handleVoteComment: (commentId: number) => void
    handleDeleteComment: (commentId: number) => void
}

const CommentCard = (props: Props) => {

    const [voted, setVoted] = useState<boolean>(false)
    const [disableVote, setDisableVote] = useState<boolean>(true)

    useEffect(() => {
        // check if user has already voted the comment
        // and set voted in advance
        DiscussionService.fetchCommentVoted(props.discussionId, props.comment.id)
            .then(res => {
                setVoted(res)
                setDisableVote(false)
            })
    }, [props.discussionId, props.comment.id])

    const handleVoteComment = async () => {
        await props.handleVoteComment(props.comment.id)
        setVoted(!voted)
    }

    const handleDeleteComment = () => {
        props.handleDeleteComment(props.comment.id)
    }

    return (
        <>
            <Divider/>
            <Grid container direction={"column"} pl={2} pr={2} pt={1}>
                <Typography sx={{fontSize: 12}}>{props.comment.text}</Typography>
                <Grid container alignItems={"center"}>
                    <IconButton disabled={disableVote} onClick={handleVoteComment}>
                        {voted ? (<ThumbUpIcon sx={{fontSize: 12}}/>) : (<ThumbUpOutlinedIcon sx={{fontSize: 12}}/>)}
                    </IconButton>
                    <Divider orientation="vertical" variant="middle" flexItem/>
                    <Typography sx={{ml: '5px'}} variant={'caption'}>{props.comment.votes}</Typography>
                    <Typography sx={{fontSize: 12, ml: 'auto'}}>—&nbsp;</Typography>
                    {props.comment.poster.role === 1 ?
                        <Avatar sx={{height: 20, width: 20, bgcolor: '#8bc34a'}} variant={'rounded'}>S</Avatar> :
                        <Avatar sx={{height: 20, width: 20, bgcolor: '#ffcd38'}} variant={'rounded'}>L</Avatar>
                    }
                    <Typography sx={{fontSize: 12}} variant={'overline'}
                                color={'primary'}>{props.comment.poster.name}&nbsp;</Typography>
                    <Typography sx={{fontSize: 12}} variant={'body2'}>at&nbsp;{props.comment.creationTime}</Typography>
                    {props.currentUser.id === props.comment.poster.id &&
                        <IconButton onClick={handleDeleteComment}>
                            <DeleteForeverIcon sx={{fontSize: 18}}/>
                        </IconButton>
                    }
                </Grid>
            </Grid>
        </>
    )
}

export default CommentCard