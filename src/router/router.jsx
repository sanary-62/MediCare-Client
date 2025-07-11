import {
  createBrowserRouter,
} from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import AvailableCamp from "../pages/AvailableCamp/AvailableCamp";
import CampDetails from "../pages/CampDetails/CampDetails";
import AddCamp from "../pages/AddCamp/AddCamp";
import PrivateRoute from "../routes/PrivateRoute"; 




export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children : [
        {
            index: true,
            Component: Home,
        },
       {
  path: 'camp-details/:campId',
  element: <CampDetails />,
},


        {
          path: 'availableCamps',
          Component: AvailableCamp,
        },
        {
  path: 'addCamp',
  element: (
    <PrivateRoute>
      <AddCamp />
    </PrivateRoute>
  )
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
        },
        {
            path: 'register',
            Component: Register,
        }
    ]
  }
]);