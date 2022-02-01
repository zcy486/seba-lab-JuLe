import HttpService from "./HttpService";
import Grade from "../models/Grade";

const baseRoute = '/grades'

const GradeService = {

    // get the grade of a student for one exercise
    getGrade: (exerciseID: number) => {
        return new Promise<Grade>((resolve) => {
            HttpService(true).get(`${baseRoute}/${exerciseID}`)
                .then(resp => resolve(resp.data))
        });
    },
};

export default GradeService;