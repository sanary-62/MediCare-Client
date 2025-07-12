import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import AvailableCamp from "../pages/AvailableCamp/AvailableCamp";
import CampDetails from "../pages/CampDetails/CampDetails";
import AddCamp from "../pages/AddCamp/AddCamp";
import PrivateRoute from "../routes/PrivateRoute";
import AboutUs from "../pages/AboutUs/AboutUs";
import DashboardLayout from "../layouts/DashboardLayout";
import RegisteredCamps from "../pages/DashBoard/Registered Camps/RegisteredCamps";
import PaymentHistory from "../pages/DashBoard/PaymentHistory/PaymentHistory";
import Analytics from "../pages/DashBoard/Analytics/Analytics";
import ParticipantProfile from "../pages/DashBoard/ParticipantProfile/ParticipantProfile";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "camp-details/:campId",
        element: <CampDetails />,
      },

      {
        path: "availableCamps",
        Component: AvailableCamp,
      },
      {
        path : "aboutUs",
        Component : AboutUs,
      },
      {
        path: "addCamp",
        element: (
          <PrivateRoute>
            <AddCamp />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute>
      <DashboardLayout></DashboardLayout>
    </PrivateRoute>,
    children: [
      {
        path: "registeredCamps",
        Component: RegisteredCamps,
      },
{
  path: "paymentHistory",
  Component: PaymentHistory,
},
{
  path: "analytics",
  Component: Analytics,
},
{
  path: "participantProfile",
  Component: ParticipantProfile,
}
    ]
  }
]);
