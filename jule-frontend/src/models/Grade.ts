import Statistic from "./Statistic";
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
    statistics: [userStatistic: Statistic, sampleSatatistic: Statistic, peerStatistic?: Statistic][],
    submission: Submission,
}

export default Grade
