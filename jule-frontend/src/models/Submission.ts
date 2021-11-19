import User from "./User";
import Exercise from "./Exercise";

type Submission = {
    id: number,
    text: string,
    exercise: Exercise,
    user: User
}

export default Submission
