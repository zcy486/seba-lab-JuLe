import { Role } from "./User"

type Auth = {
    name?: string,
    email: string,
    password: string,
    role?: string,
    universityId?: number
}

export default Auth
