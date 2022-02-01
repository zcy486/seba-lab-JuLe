import User from "./User";
import Exercise from "./Exercise";

type Submission = {
    id: number,
    text: string,
    exerciseId: number,
    accountId: number
}

export default Submission
