import {pageCount, mockExercisesPerPage} from "./MockData";

const ExerciseService = {
    getPageCount: async () => await pageCount,
    getExercisesPerPage: async (page: number) => await mockExercisesPerPage(page),
};

export default ExerciseService;