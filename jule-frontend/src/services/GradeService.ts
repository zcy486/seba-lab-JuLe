import HttpService from "./HttpService";
import Grade from "../models/Grade";

const baseRoute = '/grades'

const ExerciseService = {

    // get the grade of a student for one exercise
    getGrade: (exerciseID: number, studentID: number) => {
        return new Promise<Grade>((resolve) => {
            HttpService(true).get(`${baseRoute}/${exerciseID}/${studentID}`)
                .then(resp => resolve(resp.data))
        });
    },
};

export default ExerciseService;