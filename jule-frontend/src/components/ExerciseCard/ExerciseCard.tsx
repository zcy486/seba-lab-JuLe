import React from "react";
import styles from "./ExerciseCard.module.css";
import {Avatar, Button, Card, CardActions, CardContent, CardHeader, Chip, Typography} from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';

const MockUni = "/images/university.svg";

interface Props {
    title: string;
    exerciseTags: string[];
    //optional properties
    scope?: string;
    uniLogo?: string;
    finished?: boolean;
    viewStatistics?: boolean;
}

const ExerciseCard = (props: Props) => {
    return (
        <Card className={styles.exerciseCard}>
            <CardHeader
                avatar={
                    <Avatar
                        alt={"Uni-Logo"}
                        src={props.uniLogo ? props.uniLogo : MockUni}
                        sx={{width: 50, height: 50}}
                        variant={"rounded"}
                    />
                }
                title={
                    <Typography
                        variant={"h5"}>
                        {props.title}
                    </Typography>
                }
                subheader={props.exerciseTags.map((val, i) => (<Chip key={i} label={val}/>))}
            >

            </CardHeader>

            {props.finished && <CardContent className={styles.additional}>
                <DoneIcon color={"success"} fontSize={"large"}/>
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
                <Button className={styles.button} variant={"contained"}>
                    View Exercise
                </Button>
            </CardActions>
        </Card>
    )
}

export default ExerciseCard;
