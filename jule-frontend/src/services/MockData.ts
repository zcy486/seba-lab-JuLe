import axios from "axios";

/* File used for supplying mock data until backend is running, could be used for testing */

// returns mock data used for activity diagram showing a random count of exercises completed in the last 180 days
export const MockUserExerciseDateData = () => {
    const today = new Date();

    function shiftDate(date: Date, numDays: number) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + numDays);
        return newDate;
    }

    function getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const randomValues = (valueCount: number): { date: Date, count: number }[] => Array.from(Array(valueCount).keys()).map((val: number) => {
        return {date: shiftDate(today, -val), count: getRandomInt(0, 5)}
    })
    return new Promise<{ date: Date, count: number }[]>((resolve, reject) => resolve(randomValues(180).reverse()))
}

// returns a mock user's name
export const MockUserName = new Promise<string>((resolve, reject) => resolve("Max Mustermann"));

// retrieves a mock user from public API and extract a name
export async function fetchUserName() {
    const http = axios.create({
        baseURL: "https://randomuser.me/api/",
        headers: {
            "Content-type": "application/json"
        }
    })
    try {
        const result = await http.get<{ results: Array<{ gender: string; name: { first: string; last: string } }> }>("")
        return result
    } catch (error) {
        console.error(error)
    }
}

// mocked exercise data
export const mockExercises = [
    {
        title: "Exercise 1",
        exerciseTags: ["indirekte Rede"],
        finished: false
    },
    {
        title: "Exercise 2",
        exerciseTags: ["Schachtelsatz"],
        finished: true
    },
    {
        title: "Exercise 3",
        exerciseTags: ["Grammatik", "Gutachtenstil"],
        finished: false
    },
    {
        title: "Exercise 4",
        exerciseTags: [],
        finished: false
    },
    {
        title: "Exercise 5",
        exerciseTags: ["Verständlichkeit"],
        finished: true
    }
];

const numPerPage = 3; //set the number of exercises displayed per page

export const mockExercisesPerPage = (page: number) => {
    return new Promise<any>((resolve) => {
        setTimeout(() => {
            let upper = Math.min(page * numPerPage, mockExercises.length);
            resolve(mockExercises.slice((page-1) * numPerPage, upper));
        }, Math.random() * 100 + 50); //simulate network latency
    });
};

export const pageCount = new Promise<number>((resolve)=> {
        resolve(Math.ceil(mockExercises.length/numPerPage));
});