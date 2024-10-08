import HttpService from "./HttpService";
import University from "../models/University";

const baseRoute = "/universities/"

const UniversityService = {
    getAll: (): Promise<University[]> =>
        HttpService(false).get<University[]>(baseRoute).then(response => response.data),
    get: (id: number): Promise<University> =>
        HttpService(false).get<University>(baseRoute + `/${id}`).then(response => response.data)
}

export default UniversityService
