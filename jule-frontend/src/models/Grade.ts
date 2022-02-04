import Statistics from "./Statistics";
import Submission from "./Submission";

export enum Score {
    Excellent = 1,
    Good,
    satisfactory,
    unsatisfactory
}

type Grade = {
    id: number,
    score: Score,
    studentId: number,
    submissionId: number,
    exerciseId: number
}

export default Grade
