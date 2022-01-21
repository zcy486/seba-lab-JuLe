import React from "react"
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {Link} from "react-router-dom";
import Divider from "@mui/material/Divider";
import {Typography} from "@mui/material";
import "./SimilarExercises.css"

type SimilarExercisesProps = {
    ids: number[];
    titles: string[];
};

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body1,
    padding: theme.spacing(1),
    background: theme.palette.primary.main,
    textAlign: 'center',
    color: 'white',
}));

const SimilarExercises = (props: SimilarExercisesProps) => {

    return (
        <Box className='similar-exercises-container' sx={{ flexGrow: 1 }}>
            <Divider />
            <Typography variant={'h6'} sx={{mt: 3}}>Exercises Similar to This One</Typography>
            <div className='similar-exercises'>
                <Grid container spacing={2}>
                    {props.titles.map( (title, index) => (
                        <Grid item xs={4} component={Link} to={'/exercises/' + props.ids[index].toString()} style={{ textDecoration: 'none' }}>
                            <Item>{title}</Item>
                        </Grid>
                    ))}
                </Grid>
            </div>
            <Divider />
        </Box>
    )
}

export default SimilarExercises