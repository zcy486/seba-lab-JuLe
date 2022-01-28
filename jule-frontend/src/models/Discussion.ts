import User from './User'
import Comment from './Comment'

type Discussion = {
    id: number,
    text: string,
    poster: User,
    creationTime: string,
    comments: Comment[],
    votes: number,
    anonymous: boolean,
}

export default Discussion