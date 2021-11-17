import Statistic from "./Statistic";
import Submission from "./Submission";
import Score from "./Score";

type Grade = {
    score: Score
    statistics: Statistic[]
    submission: Submission
}

export default Grade
