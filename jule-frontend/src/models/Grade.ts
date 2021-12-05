import Statistics from "./Statistics";
import Submission from "./Submission";

export enum Score {
    Unsatisfactory = 1,
    Satisfactory,
    Good,
    Excellent
}

type Grade = {
    id: number,
    score: Score,
    statistics: [userStatistic: Statistics, sampleSatatistic: Statistics, peerStatistic?: Statistics][],
    submission: Submission,
}

export default Grade
