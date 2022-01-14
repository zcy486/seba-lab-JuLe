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
}

export default DiscussionService