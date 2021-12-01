import HttpService from "./HttpService";
import User from "../models/User";
import Auth from "../models/Auth";

const AuthService = {
    login: (email: string, password: string): Promise<User> => HttpService.post<User>("/login/").then(response => response.data),

    register: async (registrationData: string) => {
        try {
            const resp = await HttpService.post('/register/', registrationData)
            console.log(resp.data)
            return resp
        } catch (err: any) {
            return err.response
        }
    }
}

export default AuthService
