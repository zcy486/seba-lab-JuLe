import HttpService from "./HttpService";
import Exercise from "../models/Exercise";

const baseRoute = '/exercises'

const ExerciseService = {

    // applies filters to backend and returns exercises with the total page number
    applyFilters: (filters: any) => {
        return new Promise<{ pages: number, exercises: Exercise[] }>((resolve) => {
            HttpService(true).post(`${baseRoute}/filters`, JSON.stringify(filters))
                .then(resp => resolve(resp.data))
        });
    },

    // get exercises per page by filters
    getExercisesPerPage: (page: number, filters: any) => {
        return new Promise<Exercise[]>((resolve) => {
            HttpService(true).post(`${baseRoute}/page/${page}`, JSON.stringify(filters))
                .then(resp => resolve(resp.data))
        });
    },

    // checks whether the exercise is submitted, returns boolean
    checkIfSubmitted: (exerciseId: number) => {
        return new Promise<boolean>((resolve) => {
            HttpService(true).get(`${baseRoute}/${exerciseId}/submitted`)
                .then(resp => resolve(resp.data))
        })
    },

    // create exercise with form data
    createExercise: (exercise: string) => {
        return new Promise<Exercise>((resolve, reject) => {
            HttpService(true).post(`${baseRoute}/create`, exercise)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response));
        });
    },

    // get exercise by id
    getExercise: (id: string) => {
        return new Promise<Exercise>((resolve, reject) => {
            HttpService(true).get(`${baseRoute}/${id}`)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    },

    // update exercise by id with form data
    updateExercise: (id: string, exercise: FormData) => {
        return new Promise<Exercise>((resolve, reject) => {
            HttpService(true).post(`${baseRoute}/${id}`, exercise)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    },

    // delete exercise by id
    deleteExercise: (id: string) => {
        return new Promise<string>((resolve, reject) => {
            HttpService(true).delete(`${baseRoute}/${id}`)
                .then(resp => resolve(resp.data.message))
                .catch(err => reject(err.response))
        })
    },

    // get similar exercises
    getSimilarExercises: (id: string) => {
        return new Promise<{ ids: number[], titles: string[] }>((resolve, reject) => {
            HttpService(true).get(`${baseRoute}/similar/${id}`)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    },

    getRecommendedExercises: () => {
        return new Promise< Exercise[] >((resolve, reject) => {
            HttpService(true).get(`${baseRoute}/recommendations/`)
                .then(resp => resolve(resp.data))
                .catch(err => reject(err.response))
        })
    }
};

export default ExerciseService;
