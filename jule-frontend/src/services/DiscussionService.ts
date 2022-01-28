import HttpService from "./HttpService";
import Discussion from "../models/Discussion";

const baseRoute = '/discussions'

const DiscussionService = {

    createDiscussion: (discussion: any) => {
        return new Promise<Discussion>((resolve, reject) => {
            HttpService(true).post(`${baseRoute}/create`, JSON.stringify(discussion))
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    },

    updateDiscussionText: (discussionId: number, text: string) => {
        return new Promise<Discussion>((resolve, reject) => {
            HttpService(true).post(`${baseRoute}/${discussionId}`, JSON.stringify({
                text: text
            }))
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    },

    deleteDiscussion: (discussionId: number) => {
        return new Promise((resolve, reject) => {
            HttpService(true).delete(`${baseRoute}/${discussionId}`)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    },

    voteDiscussion: (discussionId: number) => {
        return new Promise<Discussion>((resolve, reject) => {
            HttpService(true).post(`${baseRoute}/${discussionId}/vote`)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    },

    // returns a boolean for whether user has voted the discussion
    fetchDiscussionVoted: (discussionId: number) => {
        return new Promise<boolean>((resolve, reject) => {
            HttpService(true).get(`${baseRoute}/${discussionId}/vote`)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    },

    addNewComment: (discussionId: number, text: string, anonymous: boolean) => {
        return new Promise<Discussion>((resolve, reject) => {
            HttpService(true).post(`${baseRoute}/${discussionId}/new_comment`, JSON.stringify({
                text: text,
                anonymous: anonymous
            }))
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    },

    deleteComment: (discussionId: number, commentId: number) => {
        return new Promise<Discussion>((resolve, reject) => {
            HttpService(true).delete(`${baseRoute}/${discussionId}/${commentId}`)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    },

    voteComment: (discussionId: number, commentId: number) => {
        return new Promise<Discussion>((resolve, reject) => {
            HttpService(true).post(`${baseRoute}/${discussionId}/${commentId}/vote`)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    },

    // returns a boolean for whether user has voted the comment
    fetchCommentVoted: (discussionId: number, commentId: number) => {
        return new Promise<boolean>((resolve, reject) => {
            HttpService(true).get(`${baseRoute}/${discussionId}/${commentId}/vote`)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    }
}

export default DiscussionService