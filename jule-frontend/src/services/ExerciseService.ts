import HttpService from "./HttpService";

const baseRoute = '/exercises'

const ExerciseService = {
    getPages: async () => {
        try {
            // TODO: get pages with filters
            const resp = await HttpService.get(`${baseRoute}/pages`)
            //console.log(resp.data)
            return resp.data.pages
        } catch (err: any) {
            console.log(err)
        }
    },

    getExercisesPerPage: async (page: number) => {
        try {
            // TODO: get exercises per page with filters
            const resp = await HttpService.get(`${baseRoute}/page/${page}`)
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