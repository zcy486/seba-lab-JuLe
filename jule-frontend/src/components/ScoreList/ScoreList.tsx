import * as React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ScoreListElement from "../ScoreListElement/ScoreListElement";



type ScoreListProps = {
    scores: [scoreTitle: string, userScore: number, peerScore: number, solutionScore: number][]
};


let ScoreList = (props: ScoreListProps) => {

    return (
        <div>
            <List>
                <Divider />
                {props.scores.map((scoreTuple) => (
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




