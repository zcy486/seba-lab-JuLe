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
    studentId: number,
    submissionId: number,
    exerciseId: number
}

export default Grade
