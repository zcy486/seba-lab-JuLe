import * as React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ScoreListElement from "../ScoreListElement/ScoreListElement";
import Statistics from "../../models/Statistics";



type ScoreListProps = {
    stats: Statistics//[scoreTitle: string, userScore: number, peerScore: number, solutionScore: number][]
};


let ScoreList = (props: ScoreListProps) => {

    return (
        <div>
            <List>
                <Divider />
                {props.stats.scores.map((scoreTuple: [scoreTitle: string, userScore: number, peerScore: number, solutionScore: number]) => (
                    <ScoreListElement
                        scoreTitle={scoreTuple[0]}
                        userScore={scoreTuple[1]}
                        peerScore={scoreTuple[2]}
                        solutionScore={scoreTuple[3]}/>
                ))}
            </List>
        </div>
    )

}

export default ScoreList;




