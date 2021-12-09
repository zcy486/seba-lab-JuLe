
export enum Score {
    Unsatisfactory = 1,
    Satisfactory,
    Good,
    Excellent
}

type Grade = {
    id: number,
    score: Score,
    studentID: number,
    submissionID: number,
    exerciseID: number
}

export default Grade
