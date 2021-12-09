import HttpService from "./HttpService";
import Auth from "../models/Auth";


const AuthService = {
    login: async (loginData: Auth) => {
        try {
            const response = await HttpService(false).post('/login/', JSON.stringify(loginData))
            localStorage.setItem('jwtToken', response.data.jwtToken)
            return response
        } catch (err: any) {
            return err.response
        }
    },

    register: async (registrationData: Auth) => {
        try {
            return await HttpService(false).post('/register/', JSON.stringify(registrationData))
        } catch (err: any) {
            return err.response
        }
    }
}

export default AuthService
