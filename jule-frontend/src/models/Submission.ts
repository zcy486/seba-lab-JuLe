import User from "./User";
import Exercise from "./Exercise";

type Submission = {
    id: number,
    text: string,
    exerciseID: number,
    userID: number
}

export default Submission
