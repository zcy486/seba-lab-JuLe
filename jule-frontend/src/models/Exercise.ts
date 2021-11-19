import Tag from "./Tag";

export enum Difficulty {
    easy = 0,
    medium,
    hard
}

export enum Scope {
    Draft,
    Internal,
    Public
}

type Exercise = {
    id: number,
    title: string,
    text: string,
    difficulty: Difficulty,
    scope: Scope,
    sampleSolution: string
    tags: Tag[]
}

export default Exercise
