import ErrorPage from "./pages/ErrorPage";
import ProfilePage from "./pages/ProfilePage";
import OverviewPage from "./pages/OverviewPage";

const routes = [
    {
        path: "/*",
        element: <ErrorPage />,
    },
    {
        path: "/profile",
        element: <ProfilePage />,
    },
    {
        path: "/overview",
        element: <OverviewPage />,
    },
    /*TODO: add routes for other pages, paths are matched exactly by default
    {
        path: ...
        element: ...
    }
    */
];

export default routes;