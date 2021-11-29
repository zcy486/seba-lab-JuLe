import HttpService from "./HttpService";

const baseRoute = '/exercises'

const ExerciseService = {
    getPages: async () => {
        try {
            // TODO: add filters to POST data
            const resp = await HttpService.post(`${baseRoute}/pages`, {})
            //console.log(resp.data)
            return resp.data.pages
        } catch (err: any) {
            console.log(err)
        }
    },

    getExercisesPerPage: async (page: number) => {
        try {
            // TODO: add filters to POST data
            const resp = await HttpService.post(`${baseRoute}/page/${page}`, {})
            //console.log(resp.data)
            return resp.data
        } catch (err: any) {
            console.log(err)
        }
    },

    createExercise: async (exercise: FormData) => {
        try {
            const resp = await HttpService.post(`${baseRoute}/create`, exercise)
            console.log(resp.data)
            return resp
        } catch (err: any) {
            return err.response
        }
    }
};

export default ExerciseService;