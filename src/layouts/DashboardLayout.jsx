import React from "react";
import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";
import MediCareLogo from "../pages/shared/MediCareLogo/MediCareLogo";
import {
  FaChartBar,
  FaUser,
  FaClipboardList,
  FaMoneyBill,
  FaHome,
  FaUsers,
  FaHourglassHalf,
  FaUserShield,
  FaPlusCircle,
  FaUsersCog
} from "react-icons/fa";
import useUserRole from "../hooks/useUserRole";

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();
  console.log(role);

  const dashboardItems = (
    <>
      <NavLink to="/" className="flex items-center gap-2">
        <FaHome className="inline" />
        Home
      </NavLink>


      {!roleLoading && role === "user" && (
        <>

      <NavLink to="/dashboard/analytics">
        <FaChartBar className="inline mr-2" /> Analytics
      </NavLink>
      <NavLink to="/dashboard/participantProfile">
        <FaUser className="inline mr-2" /> Participant Profile
      </NavLink>
      <NavLink to="/dashboard/registeredCamps">
        <FaClipboardList className="inline mr-2" /> Registered Camps
      </NavLink>
      <NavLink to="/dashboard/paymentHistory">
        <FaMoneyBill className="inline mr-2" /> Payment History
      </NavLink>
      </>
      )}

      {/* organizers links */}
      {!roleLoading && role === "organizer" && (

        <>
        <NavLink to="/dashboard/organizerProfile">
  <FaUser className="inline mr-2" /> Organizer Profile
</NavLink>

<NavLink to="/dashboard/addCamp">
  <FaPlusCircle className="inline mr-2" /> Add A Camp
</NavLink>

<NavLink to="/dashboard/manageCamps">
  <FaClipboardList className="inline mr-2" /> Manage Camps
</NavLink>

<NavLink to="/dashboard/manageRegisteredCamps">
  <FaUsersCog className="inline mr-2" /> Manage Registered Camps
</NavLink>

        </>
      ) }





      {/* admin links */}
      {!roleLoading && role === "admin" && (

        <>
          <NavLink to="/dashboard/activeOrganizers" className="flex items-center gap-2">
            <FaUsers className="inline mr-2" /> Active Organizers
          </NavLink>

          <NavLink to="/dashboard/pendingOrganizers" className="flex items-center gap-2">
            <FaHourglassHalf className="inline mr-2" /> Pending Organizers
          </NavLink>

          <NavLink to="/dashboard/addCamp">
  <FaPlusCircle className="inline mr-2" /> Add A Camp
</NavLink>

<NavLink to="/dashboard/manageCamps">
  <FaClipboardList className="inline mr-2" /> Manage Camps
</NavLink>


<NavLink to="/dashboard/manageRegisteredCamps">
  <FaUsersCog className="inline mr-2" /> Manage Registered Camps
</NavLink>

          
          <NavLink to="/dashboard/manageAdmin">
            <FaUserShield className="inline mr-2" /> Manage Admin
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col ">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none ">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <NavLink to="/" className="w-fit">
            <MediCareLogo />
          </NavLink>
        </div>
        {/* Page content here */}
        <Outlet></Outlet>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4 text-xl font-bold text-sky-800 mt-2">
          {/* Sidebar content here */}
          <NavLink to="/" className="w-fit">
            <MediCareLogo />
          </NavLink>

          {dashboardItems}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
