import React, {useEffect, useState} from "react"
import UserService from "../../services/UserService";
import StudentProfileContent from "./StudentProfileContent/StudentProfileContent";
import LecturerProfileContent from "./LectureProfileContent/LecturerProfileContent";
import User, {Role} from "../../models/User";
import Loading from "../../components/Loading";

const ProfilePage = () => {

    // States
    const [user, setUser] = useState<User>()

    // Getters
    const getUser = () => {
        UserService.getCurrentUser().then(val => setUser(val))
    }

    // Set states when loading the component
    useEffect(() => {
        getUser()
    }, [])

    /* Conditional components */

    const ProfileContent = () => {
        //console.log(`Wow look here: ${Role.Lecturer.valueOf()}`)
        if (user?.role.valueOf() === Role.Student.valueOf()){
            return <StudentProfileContent />
        } else if (user?.role.valueOf() === Role.Lecturer.valueOf()){
            return <LecturerProfileContent />
        } else {
            return <Loading/>
        }
    }

    return (
        <div>
            <h1>{user?.name}</h1>
            <ProfileContent />
        </div>
    )
}

export default ProfilePage
