
export enum Score {
    Unsatisfactory = 1,
    Satisfactory,
    Good,
    Excellent
}

type Grade = {
    id: number,
    score: Score,
    submissionID: number,
    studentID: number,
}

export default Grade
