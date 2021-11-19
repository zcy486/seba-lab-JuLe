import University from "./University";

export enum Role {
    Student,
    Lecturer
}

type User = {
    id: number,
    name: string,
    role: Role,
    lastLogin: Date,
    registerDate: Date,
    university: University
}

export default User
