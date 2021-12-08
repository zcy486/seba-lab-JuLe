import Tag from "./Tag";
import User from "./User";

export enum Difficulty {
    easy = 1,
    medium = 2,
    hard = 3
}

export enum Scope {
    draft = 1,
    internal = 2,
    public = 3
}

type Exercise = {
    id: number,
    title: string,
    explanation: string,
    question: string,
    difficulty: Difficulty,
    scope: Scope,
    sampleSolution: string,
    tags: Tag[],
    owner: User
}

export default Exercise
