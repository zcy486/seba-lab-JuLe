import HttpService from "./HttpService";
import Statistics from "../models/Statistics";
import StatisticType from "../models/StatisticType";

const baseRouteStatistics = '/statistics'

const baseRouteStatisticTypes = '/statisticTypes'

const StatisticsService = {

    // get all statistics for the submission of a student to an exercise
    getStatistics: (exerciseID: string, studentID: string) => {
        return new Promise<Statistics>((resolve) => {
            HttpService(true).get(`${baseRouteStatistics}/${exerciseID}/${studentID}`)
                .then(resp => resolve(resp.data))
        });
    },

    // get the information about all available statistics
    getStatisticTypes: () => {
        return new Promise<StatisticType[]>((resolve) => {
            HttpService(true).get(`${baseRouteStatisticTypes}`)
                .then(resp => resolve(resp.data))
        });
    },
};

export default StatisticsService;