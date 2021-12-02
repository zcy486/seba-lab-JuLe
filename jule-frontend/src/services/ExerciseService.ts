import HttpService from "./HttpService";
import Exercise from "../models/Exercise";

const baseRoute = '/exercises'

const ExerciseService = {
    getPages: () => {
        return new Promise<number>((resolve) => {
            HttpService.get(`${baseRoute}/pages`)
                .then(resp => resolve(resp.data.pages))
        });
    },

    getExercisesPerPage: (page: number) => {
        return new Promise<Exercise[]>((resolve) => {
            HttpService.get(`${baseRoute}/page/${page}`)
                .then(resp => resolve(resp.data))
        });
    },

    createExercise: (exercise: FormData) => {
        return new Promise<Exercise>((resolve, reject) => {
            HttpService.post(`${baseRoute}/create`, exercise)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response));
        });
    }
};

export default ExerciseService;