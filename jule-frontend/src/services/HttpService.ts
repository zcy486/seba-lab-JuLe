import { serverLocation } from "../config.json"
import axios from "axios";

// All requests are directed towards the one backend defined in config.json
const httpServer = serverLocation


// a base http request using axios
export const HttpService = axios.create({baseURL: serverLocation, headers: {"Content-Type":"application/json"}})

// TODO: decide if this should be deleted
// a basic http request using fetch()
const baseRequest = async (route: string,
                           onSuccess: (response: Response) => any,
                           onFailure: (error: String) => any,
                           method: string) => {
    try {
        if (route[0] != "/") {
            throw Error("all routes must begin with a forward slash '/'");
        }

        // Base header
        const header = new Headers()
        header.append("Content-Type", "application/json")
        // TODO: add authentication to header

        const url = httpServer + route
        const response = await fetch(url, {method: method, headers: header});
        if (!response.ok) {
            // response is not okay
            onFailure(response.statusText)
        } else {
            // response is okay
            onSuccess(await response.json())
        }
    } catch (error: unknown) {
        if (error instanceof Error){
            onFailure(error.message)
        } else {
            throw Error("Caught something that is not an Error")
        }
    }
}

const FetchHttpService = {
    get: async (
        route: string,
        onSuccess: (response: Response) => any,
        onFailure: (error: String) => any
    ) => {
        await baseRequest(route, onSuccess, onFailure, "GET")
    },
    post: async (
        route: string,
        onSuccess: (response: Response) => any,
        onFailure: (error: String) => any
    ) => {
        await baseRequest(route, onSuccess, onFailure, "POST")
    },
    put: async (
        route: string,
        onSuccess: (response: Response) => any,
        onFailure: (error: String) => any
    ) => {
        await baseRequest(route, onSuccess, onFailure, "PUT")
    },
    delete: async (
        route: string,
        onSuccess: (response: Response) => any,
        onFailure: (error: String) => any
    ) => {
        await baseRequest(route, onSuccess, onFailure, "DELETE")
    }
}

export default HttpService
