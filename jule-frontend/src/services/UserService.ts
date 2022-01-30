import {fetchUserName, MockUserExerciseDateData, MockUserName} from "./MockData";
import HttpService from "./HttpService";
import User from "../models/User";

const baseRoute = "/users"

const UserService = {
    // getName: async () => await MockUserName,
    // getName2: async () => fetchUserName().then(val => {
    //     return val!.data.results[0].name.last
    // }),
    // getExerciseDateData: async () => MockUserExerciseDateData(),
    getExerciseDateData: (): Promise<{date: Date, count: number}[]> => HttpService(true).get<{date: Date, count: number}[]>("submission/hotstreak").then(response => response.data),
    getHotStreak: async () => {
        try {
            const exerciseData = (await UserService.getExerciseDateData()).reverse()
            const streakDays = exerciseData.splice(0, exerciseData.findIndex(elem => elem.count === 0))
            const streakLength = streakDays.length
            const exerciseCount = streakDays.reduce<number>((total, current) => total + current.count, 0)
            return {dayCount: streakLength, exerciseCount: exerciseCount}
        } catch (e) {
            console.error(e)
        }
    },
    getCurrentUser: (): Promise<User> => HttpService(true).get<User>(baseRoute + "/current").then(response => response.data)
}

export default UserService
