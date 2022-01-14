import User from "./User";

type Comment = {
    id: number,
    text: string,
    poster: User,
    creationTime: string,
}

export default Comment