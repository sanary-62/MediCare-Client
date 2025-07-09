import {
  createBrowserRouter,
} from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children : [
        {
            index: true,
            Component: Home,
        }
    ]
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
        {
            path: 'login',
            Component: Login,
        }
    ]
  }
]);