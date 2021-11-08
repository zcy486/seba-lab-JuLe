import React from "react";
import {Paper} from "@mui/material";
import emoji from "react-easy-emoji";
import styles from "./StreakDisplay.module.css"

type StreakDisplayProps = {
  exerciseCount: number,
  dayCount: number
}

const StreakDisplay = (props: StreakDisplayProps) => {
  return (
    <div>
      <Paper elevation={3}>
        <div className={styles.innerDiv}>
          <div className={styles.fireEmoji}>
            {emoji("🔥")}
          </div>
          <div className={styles.textStack}>
            <div className={styles.hotStreakText}>
              You're on a hot streak!
            </div>
            <div>
              You completed <b>{props.exerciseCount}</b> exercises in <b>{props.dayCount}</b> days!
            </div>
            <div>
              Keep it up!
            </div>
          </div>
        </div>
      </Paper>
    </div>
  )

}

export default StreakDisplay
