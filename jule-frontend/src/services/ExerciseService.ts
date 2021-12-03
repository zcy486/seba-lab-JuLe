import HttpService from "./HttpService";
import Exercise from "../models/Exercise";

const baseRoute = '/exercises'

const ExerciseService = {

    // applies filters to backend and returns exercises with the total page number
    applyFilters: (filters: FormData) => {
        return new Promise<any>((resolve) => {
            HttpService.post(`${baseRoute}/filters`, filters)
                .then(resp => resolve(resp.data))
        });
    },

    // get exercises per page by filters
    getExercisesPerPage: (page: number, filters: FormData) => {
        return new Promise<Exercise[]>((resolve) => {
            HttpService.post(`${baseRoute}/page/${page}`, filters)
                .then(resp => resolve(resp.data))
        });
    },

    createExercise: (exercise: FormData) => {
        return new Promise<Exercise>((resolve, reject) => {
            HttpService.post(`${baseRoute}/create`, exercise)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response));
        });
    },

    getExercise: (id: string) => {
        return new Promise<Exercise>((resolve, reject) => {
            HttpService.get(`${baseRoute}/${id}`)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    }
};

export default ExerciseService;