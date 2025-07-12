import React from "react";
import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";

const dashboardItems = (
  <>
    <NavLink to="/dashboard/analytics">Analytics</NavLink>
    <NavLink to="/dashboard/participantProfile">Participant Profile</NavLink>
    <NavLink to="/dashboard/registeredCamps">Registered Camps</NavLink>

    <NavLink to="/dashboard/paymentHistory">Payment History</NavLink>
  </>
);

const DashboardLayout = () => {
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
          <div className="mx-2 flex-1 px-2 lg:hidden">Dashboard</div>
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
        <ul className="menu bg-base-200 min-h-full w-80 p-4 text-xl font-bold text-sky-800">
          {/* Sidebar content here */}
          {dashboardItems}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
