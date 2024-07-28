import MainPage from "./pages/MainPage";
import UserPage from "./pages/UserPage";

export default [
    { path: "/", element: <MainPage /> },
    { path: "/user", element: <UserPage /> }
];