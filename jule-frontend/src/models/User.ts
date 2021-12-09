import University from "./University";

export enum Role {
    Student= 1,
    Lecturer= 2
}

type User = {
    id: number,
    name: string,
    role: Role,
    university: University
}

export default User
