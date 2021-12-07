import University from "./University";

export enum Role {
    Student,
    Lecturer
}

type User = {
    id: number,
    name: string,
    role: Role,
    university: University
}

export default User
