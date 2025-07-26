import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import AvailableCamp from "../pages/AvailableCamp/AvailableCamp";
import CampDetails from "../pages/CampDetails/CampDetails";
import PrivateRoute from "../routes/PrivateRoute";
import AboutUs from "../pages/AboutUs/AboutUs";
import DashboardLayout from "../layouts/DashboardLayout";
import RegisteredCamps from "../pages/DashBoard/Registered Camps/RegisteredCamps";
import PaymentHistory from "../pages/DashBoard/PaymentHistory/PaymentHistory";
import Analytics from "../pages/DashBoard/Analytics/Analytics";
import ParticipantProfile from "../pages/DashBoard/ParticipantProfile/ParticipantProfile";
import Payment from "../pages/DashBoard/Payment/Payment";
import BeAOrganizer from "../pages/DashBoard/BeAOrganizer/BeAOrganizer";
import PendingOrganizers from "../pages/DashBoard/PendingOrganizers/PendingOrganizers";
import ActiveOrganizers from "../pages/DashBoard/ActiveOrganizers/ActiveOrganizers";
import Error from "../pages/Error/Error"
import ManageAdmin from "../pages/DashBoard/ManageAdmin/ManageAdmin";
import Forbidden from "../pages/Forbidden/Forbidden";
import AdminRoute from "../routes/AdminRoute";
import AddCamp from "../pages/DashBoard/AddCamp/AddCamp";
import ManageCamps from "../pages/DashBoard/ManageCamps/ManageCamps";
import ManageRegisteredCamps from "../pages/DashBoard/ManageRegisteredCamps/ManageRegisteredCamps";
import UpdateCamp from "../pages/DashBoard/UpdateCamp/UpdateCamp";
import OrganizerProfile from "../pages/DashBoard/OrganizerProfile/OrganizerProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <Error />,
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
        path: "aboutUs",
        Component: AboutUs,
      },
      {
        path: "beAOrganizer",
        element: (
          <PrivateRoute>
            <BeAOrganizer />
          </PrivateRoute>
        )
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
    path: "forbidden",
    Component: Forbidden,
  },
  {
    path: "/",
    Component: AuthLayout,
    errorElement: <Error />,
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
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    errorElement: <Error />,
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
      },
      {
        path: "payment/:campId",
        Component: Payment,
      },
      {
        path: "pendingOrganizers",
        element: <AdminRoute><PendingOrganizers></PendingOrganizers></AdminRoute>
      },
      {
        path: "activeOrganizers",
        element: <AdminRoute><ActiveOrganizers></ActiveOrganizers></AdminRoute>
      },
      {
        path: "manageAdmin",
        element: <AdminRoute><ManageAdmin></ManageAdmin></AdminRoute>
      },
      {
      path: "addCamp",
      element: <PrivateRoute><AddCamp></AddCamp></PrivateRoute>
      },
      {
       path: "organizerProfile",
      element: <PrivateRoute><OrganizerProfile></OrganizerProfile></PrivateRoute>
      },
      {
      path: "manageCamps",
      element: <PrivateRoute><ManageCamps></ManageCamps></PrivateRoute>
      },
      {
      path: "update-camp/:campId",
      element: <PrivateRoute><UpdateCamp></UpdateCamp></PrivateRoute>
      },
      {
      path: "manageRegisteredCamps",
      element: <PrivateRoute><ManageRegisteredCamps></ManageRegisteredCamps></PrivateRoute>
      }
    ],
  },
]);
