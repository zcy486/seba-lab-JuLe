import HttpService from "./HttpService";
import Exercise from "../models/Exercise";

const baseRoute = '/exercises'

const ExerciseService = {
    
    // applies filters to backend and returns exercises with the total page number
    applyFilters: (filters: FormData) => {
        return new Promise<any>((resolve) => {
            HttpService(true).post(`${baseRoute}/filters`, filters)
                .then(resp => resolve(resp.data))
        });
    },

    // get exercises per page by filters
    getExercisesPerPage: (page: number, filters: FormData) => {
        return new Promise<Exercise[]>((resolve) => {
            HttpService(true).post(`${baseRoute}/page/${page}`, filters)
                .then(resp => resolve(resp.data))
        });
    },

    // create exercise with form data
    createExercise: (exercise: FormData) => {
        return new Promise<Exercise>((resolve, reject) => {
            HttpService(true).post(`${baseRoute}/create`, exercise)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response));
        });
    },

    // get exercise by id
    getExercise: (id: string) => {
        return new Promise<Exercise>((resolve, reject) => {
            HttpService.get(`${baseRoute}/${id}`)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    },

    // update exercise by id with form data
    updateExercise: (id:string, exercise: FormData) => {
        return new Promise<Exercise>((resolve, reject) => {
            HttpService.post(`${baseRoute}/${id}`, exercise)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    },

    // delete exercise by id
    deleteExercise: (id:string) => {
        return new Promise<string>((resolve,reject) => {
            HttpService.delete(`${baseRoute}/${id}`)
                .then(resp => resolve(resp.data.message))
                .catch(err => reject(err.response))
        })
    }
};

export default ExerciseService;