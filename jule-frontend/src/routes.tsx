import ErrorPage from "./pages/ErrorPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ExercisesPage from "./pages/Exercises/ExercisesPage/ExercisesPage";
import LandingPage from "./pages/LandingPage/LandingPage";

//TODO: this file can be removed if we are using nested routes in index.tsx
const routes = [
    {
        path: "/",
        element: <LandingPage/>,
    },
    {
        path: "/profile",
        element: <ProfilePage/>,
    },
    {
        path: "/exercises",
        element: <ExercisesPage/>,
    },
    {
        path: "/*",
        element: <ErrorPage/>,
    },
    /*TODO: add routes for other pages, paths are matched exactly by default
    {
        path: ...
        element: ...
    }
    */
];

export default routes;
