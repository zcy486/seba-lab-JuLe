import React from "react";
import styles from "./ExerciseCard.module.css";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Chip, Typography } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import { useNavigate } from "react-router-dom";

const MockUni = "/images/university.svg";

interface Props {
    id: number;
    title: string;
    exerciseTags: string[];
    //optional properties
    scope?: string;
    uniLogo?: string;
    finished?: boolean;
    viewStatistics?: boolean;
}

const ExerciseCard = (props: Props) => {

    const navigate = useNavigate()

    return (
        <Card className={styles.exerciseCard}>
            <CardHeader
                avatar={
                    <img
                        alt="Uni-Logo"
                        src={props.uniLogo ? props.uniLogo : MockUni}
                        className={styles.universityLogo}
                    />
                }
                title={
                    <Typography
                        variant={"h5"}>
                        {props.title}
                    </Typography>
                }
                subheader={props.exerciseTags.map((val, i) => (<Chip key={i} label={val} />))}
            >

            </CardHeader>

            {props.finished && <CardContent className={styles.additional}>
                <DoneIcon color={"success"} fontSize={"large"} />
            </CardContent>}
            {props.scope && <CardContent className={styles.additional}>
                <Typography>
                    {props.scope}
                </Typography>
            </CardContent>}
            <CardActions className={styles.actionsArea}>
                {props.viewStatistics && <Button className={styles.button}
                    variant={"contained"}>
                    View Statistics
                </Button>}
                <Button className={styles.button} variant={"contained"}
                    onClick={() => navigate(`/exercises/${props.id}`)}>
                    View Exercise
                </Button>
            </CardActions>
        </Card>
    )
}

export default ExerciseCard;
