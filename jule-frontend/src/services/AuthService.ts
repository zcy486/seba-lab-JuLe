import HttpService from "./HttpService";
import Auth from "../models/Auth";

const AuthService = {
    login: async (loginData: Auth) => {
        try {
            const response = await HttpService(false).post('/login/', JSON.stringify(loginData))
            if (response.data.jwtToken === null)
                return response // Error message
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
    },

    verify_email: async (verifyEmailToken: string) => {
        try {
            const response = await HttpService(false, verifyEmailToken).get('/verify_email/')
            if (response.data.jwtToken === null)
                return response // Error message
            localStorage.setItem('jwtToken', response.data.jwtToken)
            return response
        } catch (err: any) {
            return err.response
        }
    },

    verify_captcha: async (captchaValue: string) => {
        try {
            return await HttpService(false).post('/register/captcha/', JSON.stringify({captchaValue: captchaValue}))
        } catch (err: any) {
            return err.response
        }
    },

    sendResetPasswordEmail: async(email: string) => {
        try {
            return await HttpService(false).post('/reset_password/', JSON.stringify({ email: email }))
        } catch (err: any) {
            return err.response
        }
    },

    changePassword: async(resetPasswordToken: string, newPassword: string) => {
        // Transmitting the password over HTTPS is secure enough
        try {
            const response = await HttpService(false, resetPasswordToken).post('/reset_password/with_token/', JSON.stringify({password: newPassword}))
            if (response.data.jwtToken === null)
                return response // Error message
            localStorage.setItem('jwtToken', response.data.jwtToken)
            return response
        } catch (err: any) {
            return err.response
        }
    },

    contact: async(name: string, email: string, message: string) => {
        try {
            return await HttpService(false).post('/contact/', JSON.stringify({name: name, email: email, message: message}))
        } catch (err: any) {
            return err.response
        }
    }
}

export default AuthService
