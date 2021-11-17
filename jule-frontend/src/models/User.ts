import University from "./University";

enum Role {
    Student,
    Lecturer
}

type User = {
    id: string,
    name: string,
    role: Role,
    lastLogin: Date,
    registerDate: Date,
    university: University
}

export default User
