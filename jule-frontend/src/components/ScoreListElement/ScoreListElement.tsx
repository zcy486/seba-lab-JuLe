import React from "react";
import ListItem from '@mui/material/ListItem';
import Divider from "@mui/material/Divider";
import "./ScoreListElement.css"



type ScoreListElementProps = {
    scoreTitle: String;
    userScore: number;
    peerScore: number;
    solutionScore: number;
};


let ScoreListElement = (props: ScoreListElementProps) => {

    return(
        <div>
            <ListItem>
                <h2 className="score-title">
                    {props.scoreTitle}
                </h2>

                <div className="score-box">
                    <span className="user-score">
                        {props.userScore}
                    </span>

                    <span className="peer-score">
                        {props.peerScore}
                    </span>

                    <span className="solution-score">
                        {props.solutionScore}
                    </span>
                </div>

            </ListItem>
            <Divider />
        </div>
    )
}

export default ScoreListElement;