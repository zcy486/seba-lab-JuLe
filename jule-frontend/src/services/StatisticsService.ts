import HttpService from "./HttpService";
import Statistics from "../models/Statistics";
import StatisticType from "../models/StatisticType";

const baseRouteStatistics = '/statistics'

const baseRouteStatisticTypes = '/statisticTypes'

const StatisticsService = {

    // get all statistics for the submission of a student to an exercise
    getStatistics: (exerciseID: Number, studentID: Number) => {
        return new Promise<Statistics>((resolve) => {
            HttpService.get(`${baseRouteStatistics}/${exerciseID}/${studentID}`)
                .then(resp => resolve(resp.data))
        });
    },

    // get the information about all available statistics
    getStatisticTypes: (exerciseID: Number, studentID: Number) => {
        return new Promise<StatisticType[]>((resolve) => {
            HttpService.get(`${baseRouteStatisticTypes}`)
                .then(resp => resolve(resp.data))
        });
    },
};

export default StatisticsService;