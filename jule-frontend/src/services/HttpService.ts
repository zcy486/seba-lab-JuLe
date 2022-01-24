import {serverLocation} from "../config.json"
import axios from "axios";

// All requests are directed towards the one backend defined in config.json
//const httpServer = serverLocation

// a base http request using axios
export const HttpService = (useAuthentication: boolean, customToken: string = "") => {
    if (customToken !== "")
        return axios.create({
            baseURL: serverLocation,
            headers: {"Content-Type": "application/json", "x-access-token": customToken}
        })
    if (useAuthentication) {
        let jwtToken = localStorage.getItem('jwtToken')
        if (jwtToken !== null) {
            return axios.create({
                baseURL: serverLocation,
                headers: {"Content-Type": "application/json", "x-access-token": jwtToken}
            })
        } else {
            throw Error('Authorization was not possible, because the JWT-Token is missing from Browser Local Storage')
        }
    } else {
        return axios.create({baseURL: serverLocation, headers: {"Content-Type": "application/json"}})
    }
}

export default HttpService
