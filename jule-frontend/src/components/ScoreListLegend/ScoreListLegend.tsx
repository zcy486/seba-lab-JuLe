import * as React from 'react';
import "./ScoreListLegend.css"


let ScoreListLegend = () => {

    return (
        <div className="score-list-legend">
            <div className="legend-item">
                <div className="legend-item-color-box-user"/>
                <h3 className="legend-item-title">You</h3>
            </div>

            <div className="legend-item">
                <div className="legend-item-color-box-peers"/>
                <h3 className="legend-item-title">Your Peers</h3>
            </div>

            <div className="legend-item">
                <div className="legend-item-color-box-solution"/>
                <h3 className="legend-item-title">Sample Solution</h3>
            </div>

        </div>
    )

}

export default ScoreListLegend;
