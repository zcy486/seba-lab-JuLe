import React, {useCallback, useEffect, useRef, useState} from "react";
import {Button, Divider, Grid, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import DiscussionService from "../../services/DiscussionService";
import HttpService from "../../services/HttpService";
import axios, {Canceler} from "axios";
import DiscussionCard from "./DiscussionCard";
import Discussion from "../../models/Discussion";
import User from "../../models/User";
import {Editor} from 'react-draft-wysiwyg';
import {EditorState, ContentState} from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface Props {
    exerciseId: string
    currentUser: User
}

const DiscussionBoard = (props: Props) => {

    const [editorState, setEditorState] = useState(() =>
        EditorState.createWithContent(ContentState.createFromText(''))
    )
    const [input, setInput] = useState<string>('')
    const [anonymous, setAnonymous] = useState<boolean>(false)
    const [order, setOrder] = useState<number>(3)
    const [page, setPage] = useState<number>(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [hasMore, setHasMore] = useState(false)
    const [discussions, setDiscussions] = useState<Discussion[]>([])

    // loading by infinite scrolling
    const observer = useRef<IntersectionObserver>()
    const lastDiscussionRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    const onCreate = () => {
        if (!input) return

        const new_discussion = {
            text: input,
            exerciseId: props.exerciseId,
            anonymous: anonymous
        }
        DiscussionService.createDiscussion(new_discussion)
            .then(res => {
                setEditorState(EditorState.createWithContent(ContentState.createFromText('')))
                reloadDiscussions()
            })
    }

    const reloadDiscussions = () => {
        setDiscussions([])
        setPage(0)
    }

    const sortByOrder = (event: React.MouseEvent<HTMLElement>, newOrder: number) => {
        setOrder(newOrder)
        setPage(1) // reload from beginning
    }

    useEffect(() => {
        // reload from beginning
        setDiscussions([])
    }, [order])

    useEffect(() => {
        if (page === 0) {
            //reset page to 1 for reloading after post a new discussion
            setPage(1)
            return
        }
        setLoading(true)
        setError(false)
        let cancel: Canceler
        HttpService(true).get('/discussions/', {
            params: {
                order: order,
                page: page,
                exerciseId: props.exerciseId
            },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            //console.log(res.data)
            setDiscussions(prevDiscussions => {
                return [...prevDiscussions, ...res.data]
            })
            setHasMore(res.data.length > 0)
            setLoading(false)
        }).catch(err => {
            if (axios.isCancel(err)) return
            setError(true)
        })
        return () => cancel()
    }, [order, page, props.exerciseId])

    useEffect(() => {
        let currentText = editorState.getCurrentContent().getPlainText()
        setInput(currentText)
    }, [editorState])

    return (
        <>
            <h1>Discussions</h1>
            <Divider/>
            <Typography variant={'h6'}>Start a new discussion</Typography>
            <div style={{border: "1px solid black", padding: '2px', minHeight: '200px'}}>
                <Editor editorState={editorState} onEditorStateChange={setEditorState}/>
            </div>
            <Grid container mb={2} justifyContent="flex-end">
                <ToggleButton size={'small'} value={'anonymous'} selected={anonymous}
                              onChange={() => setAnonymous(!anonymous)}>
                    Anonymous
                </ToggleButton>
                <Button size={'small'} onClick={onCreate}>Post</Button>
            </Grid>
            <Divider/>
            <Grid container justifyContent="flex-end">
                <ToggleButtonGroup
                    value={order}
                    exclusive
                    onChange={sortByOrder}
                >
                    <ToggleButton value={1}>Oldest</ToggleButton>
                    <ToggleButton value={2}>Newest</ToggleButton>
                    <ToggleButton value={3}>Votes</ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            {discussions.map((discussion, i) => {
                return discussions.length === i + 1 ?
                    (
                        <div key={i} ref={lastDiscussionRef}>
                            <DiscussionCard
                                discussion={discussion}
                                currentUser={props.currentUser}
                                reloadDiscussions={reloadDiscussions}
                            />
                        </div>
                    ) : (
                        <div key={i}>
                            <DiscussionCard
                                discussion={discussion}
                                currentUser={props.currentUser}
                                reloadDiscussions={reloadDiscussions}
                            />
                        </div>
                    )
            })}
            <Typography variant={'h5'}>{loading && 'Loading...'}</Typography>
            <Typography variant={'h5'} color={'error'}>{error && 'Error'}</Typography>
        </>
    )
}

export default DiscussionBoard;