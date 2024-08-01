import MainPage from "./pages/MainPage";
import SubjectsPage from "./pages/SubjectsPage";
import UserPage from "./pages/UserPage";

export default [
    { path: "/", element: <MainPage /> },
    { path: "/user", element: <UserPage /> },
    { path: "/subjects", element: <SubjectsPage /> }
];