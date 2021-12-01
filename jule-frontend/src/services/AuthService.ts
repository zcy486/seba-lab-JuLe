import HttpService from "./HttpService";
import Auth from "../models/Auth";

const AuthService = {
    login: async (loginData: Auth) => {
        try {
            return await HttpService.post('/login/', JSON.stringify(loginData))
        } catch (err: any) {
            return err.response
        }
    },

    register: async (registrationData: Auth) => {
        try {
            return await HttpService.post('/register/', JSON.stringify(registrationData))
        } catch (err: any) {
            return err.response
        }
    }
}

export default AuthService
