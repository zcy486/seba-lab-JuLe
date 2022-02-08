import React, { useEffect, useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ExerciseService from "../../services/ExerciseService";
import StatisticsService from "../../services/StatisticsService";
import SubmissionService from "../../services/SubmissionService";
import Loading from "../../components/Loading";
import Button from "@mui/material/Button";
import Statistics from "../../models/Statistics";
import ScoreList from "../../components/ScoreList/ScoreList";
import ScoreListLegend from "../../components/ScoreListLegend/ScoreListLegend";
import Grade, { Score } from "../../models/Grade";
import GradeService from "../../services/GradeService";
import SimilarExercises from "../../components/SimilarExercises/SimilarExercises";

const ExerciseResultPage = () => {

    const { id } = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [solution, setSolution] = useState<string>();
    const [submission, setSubmission] = useState<string>();
    const [results, setResults] = useState<Statistics>();
    const [grade, setGrade] = useState<Grade>();
    const [simExercisesIds, setSimExercisesIds] = useState<number[]>([]);
    const [simExercisesTitles, setSimExercisesTitles] = useState<string[]>([]);

    //indicator of loading state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            SubmissionService.getSubmission(id).then(
                val => setSubmission(val.text)
            ).catch(err => {
                if (err.status === 405) {
                    alert('We have trouble retrieving your submission')
                } else if (err.status === 401) {
                    alert('You are not authorized to view this exercise!')
                } else {
                    alert('Unknown error.')
                }
            });
            // fetch exercise details
            ExerciseService.getExercise(id)
                .then(resp => {
                    setTitle(resp.title)
                    setTags(resp.tags.map((tag) => tag.name))
                    setSolution(resp.sampleSolution)
                    setLoading(false)
                })
                .catch(err => {
                    if (err.status === 405) {
                        alert('No exercise found with matching id!')
                    } else if (err.status === 401) {
                        alert('You are not authorized to view this exercise!')
                    } else {
                        alert('Unknown error.')
                    }
                });
            StatisticsService.getStatistics(id).then(
                val => setResults(val)
            ).catch(err => {
                if (err.status === 405) {
                    alert('We have trouble retrieving your statistics')
                } else if (err.status === 401) {
                    alert('You are not authorized to view this exercise!')
                } else {
                    alert('Unknown error.')
                }
            });
            // fetch grade
            GradeService.getGrade(parseInt(id)).then(
                val => setGrade(val)
            ).catch(err => {
                if (err.status === 405) {
                    alert('We have trouble retrieving your statistics')
                } else if (err.status === 401) {
                    alert('You are not authorized to view this exercise!')
                } else {
                    alert('Unknown error.')
                }
            });
            // get similar exercises
            ExerciseService.getSimilarExercises(id)
                .then(resp => {
                    setSimExercisesIds(resp.ids)
                    setSimExercisesTitles(resp.titles)
                })
                .catch((err: any) => {
                    if (err.status === 405) {
                        alert('No exercise found with matching id!')
                    } else if (err.status === 401) {
                        alert('You are not authorized to view this exercise!')
                    } else {
                        alert('Unknown error.')
                    }
                });
        }
    }, [id])

    const onEdit = () => {
        navigate(`/exercises/${id}`)
    }

    return (
        <div>
            {loading ?
                (
                    <Loading />
                ) :
                (
                    <div>
                        <h1>{title}</h1>
                        <Box sx={{ display: 'flex' }}>
                            {tags && tags.map((tag) => <Chip key={tag} label={tag} sx={{ mr: 1 }} />)}
                        </Box>

                        <Typography variant={'h5'} sx={{ mt: 3 }}>Your Results</Typography>
                        <div className="verticalSpacer" />
                        <Typography variant="h5" align="center" fontWeight="bold">{grade ? Score[grade?.score] : <></>}</Typography>
                        <div className="verticalSpacer" />

                        <ScoreListLegend />

                        {results ? (<ScoreList stats={results} />) : (<></>)}

                        <div className="verticalSpacer" />

                        <Typography variant={'h5'} sx={{ mt: 3 }}>The Sample Solution</Typography>
                        <p>{solution}</p>

                        <Typography variant={'h5'} sx={{ mt: 3 }}>Your Solution</Typography>
                        <p>{submission}</p>
                        <div className="verticalSpacer" />

                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button className="text-editor-button" variant="contained" onClick={onEdit}>Edit
                                Submission
                            </Button>
                        </Box>

                        <div className="verticalSpacer" />
                        <div className="verticalSpacer"/>

                        {simExercisesIds.length > 0 ?
                            <SimilarExercises ids={simExercisesIds} titles={simExercisesTitles}/> : <></>
                        }

                    </div>
                )
            }
        </div>
    )
};

export default ExerciseResultPage;
