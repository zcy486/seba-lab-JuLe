import HttpService from "./HttpService";
import Tag from "../models/Tag";

const baseRoute = "/tags"

const TagService = {
    getAll: (): Promise<Tag[]> => HttpService.get<Tag[]>(baseRoute).then(response => response.data),
    get: (id: number): Promise<Tag> => HttpService.get<Tag>(baseRoute).then(response => response.data)
}

export default TagService
