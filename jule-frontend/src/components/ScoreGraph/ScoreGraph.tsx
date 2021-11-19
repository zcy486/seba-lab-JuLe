import React from "react"
import {Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Card, CardContent, Typography} from "@mui/material";

type ScoreGraphProps = {}

const ScoreGraph = (props: ScoreGraphProps) => {

    /*
    Default colors:
    Red: #eb4034
    Yellow: #ebd334
    Green: #34eb4c
    Cyan: #34ebe8
     */

    enum Score {
        Unsatisfactory = 1,
        Satisfactory,
        Good,
        Excellent
    }

    const getColor = (score: Score) => {
        const colors = ["#eb4034", "#ebd334", "#34eb4c", "#34ebe8"]
        return colors[score - 1]
    }

    const data = [
        {
            name: 'Exercise 1',
            score: 2,
        },
        {
            name: 'Exercise 2',
            score: 1,
        },
        {
            name: 'Exercise 3',
            score: 3,
        },
        {
            name: 'Exercise 4',
            score: 2,
        },
        {
            name: 'Exercise 5',
            score: 1,
        },
        {
            name: 'Exercise 6',
            score: 3,
        },
        {
            name: 'Exercise 7',
            score: 4,
        },
    ];

    const CustomTooltip = ({active, payload, label}: any) => {
        if (active && payload && label.length) {
            return (
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {label}
                        </Typography>
                        <Typography color="text.secondary">
                            {Score[payload[0].payload.score]}
                        </Typography>
                    </CardContent>
                </Card>
            );
        }
        return null;
    }

    return (
        <div style={{height: "20rem", maxWidth: "80rem", width: "100%"}}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{
                    top: 5,
                    right: 5,
                    left: 5,
                    bottom: 5,
                }}>
                    <XAxis dataKey="name" tickLine={false}/>
                    <YAxis type="number" domain={[0, 4.5]} tickLine={false} axisLine={false} tick={false}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="score">
                        {data.map((entry, index) => (
                            <Cell fill={getColor(entry.score)}/>
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

}

export default ScoreGraph
