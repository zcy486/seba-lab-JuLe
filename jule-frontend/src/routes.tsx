import ErrorPage from "./pages/ErrorPage";
import ProfilePage from "./pages/ProfilePage";
import OverviewPage from "./pages/OverviewPage";
import LandingPage from "./pages/LandingPage/LandingPage";

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
        path: "/overview",
        element: <OverviewPage/>,
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
