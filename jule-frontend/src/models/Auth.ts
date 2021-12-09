import { Role } from "./User"

// TODO: maybe have more defined split between User and Auth Schemas from the Account
type Auth = {
    name?: string,
    email: string,
    password: string,
    role?: string,
    universityId?: number
}

export default Auth
