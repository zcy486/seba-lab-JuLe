import HttpService from "./HttpService";
import Submission from "../models/Submission";

const baseRoute = '/submission'

const SubmissionService = {

    // create submission
    createSubmission: (exerciseID: string, submission: {text: string}) => {
        return new Promise<Submission>((resolve, reject) => {
            HttpService(true).post(`${baseRoute}/${exerciseID}`, submission)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response));
        });
    },

    // get submission by exercise id
    getSubmission: (exerciseID: string) => {
        return new Promise<Submission>((resolve, reject) => {
            HttpService(true).get(`${baseRoute}/${exerciseID}`)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    },

    // get submissions from user
    getAllSubmissions: () => {
        return new Promise<Submission[]>((resolve, reject) => {
            HttpService(true).get(`${baseRoute}/all`)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    },

};

export default SubmissionService;