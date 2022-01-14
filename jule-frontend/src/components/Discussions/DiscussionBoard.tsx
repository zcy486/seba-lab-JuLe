import React, {useCallback, useEffect, useRef, useState} from "react";
import {Button, Divider, Grid, TextField, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import DiscussionService from "../../services/DiscussionService";
import HttpService from "../../services/HttpService";
import axios, {Canceler} from "axios";
import DiscussionCard from "./DiscussionCard";
import Discussion from "../../models/Discussion";
import User from "../../models/User";

interface Props {
    exerciseId: string
    currentUser: User
}

const DiscussionBoard = (props: Props) => {

    const [input, setInput] = useState('')
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

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }

    const onCreate = () => {
        const new_discussion = {
            text: input,
            exerciseId: props.exerciseId
        }
        DiscussionService.createDiscussion(new_discussion)
            .then(res => {
                setInput('')
                window.location.reload()
            })
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
    }, [order, page])

    return (
        <>
            <h1>Discussions</h1>
            <Divider/>
            <Typography variant={'h6'}>Start a new discussion</Typography>
            <TextField
                fullWidth
                multiline
                maxRows={4}
                value={input}
                onChange={handleInput}
                size={"small"}
                placeholder={'Start a new discussion here...'}
            />
            <Grid container justifyContent="flex-end">
                <Button onClick={onCreate}>Post</Button>
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
                            />
                        </div>
                    ) : (
                        <div key={i}>
                            <DiscussionCard
                                discussion={discussion}
                                currentUser={props.currentUser}
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