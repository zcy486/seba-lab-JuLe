import HttpService from "./HttpService";
import Submission from "../models/Submission";

const baseRoute = '/submission'

const SubmissionService = {

    // create submission
    createSubmission: (userID: string, exerciseID: string, submission: {text: string}) => {
        return new Promise<Submission>((resolve, reject) => {
            HttpService(true).post(`${baseRoute}/${userID}/${exerciseID}`, submission)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response));
        });
    },

    // get submission by exercise id
    getSubmission: (userID: string, exerciseID: string) => {
        return new Promise<Submission>((resolve, reject) => {
            HttpService(true).get(`${baseRoute}/${userID}/${exerciseID}`)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    },

};

export default SubmissionService;