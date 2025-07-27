import React, { useEffect, useState } from "react"; 
import { NavLink } from 'react-router-dom';
import MediCareLogo from '../MediCareLogo/MediCareLogo';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure'; 

const Navbar = () => {
  const { user, logOut } = useAuth(); 
  const [profileData, setProfileData] = useState(null);
  const axiosSecure = useAxiosSecure(); 

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/users/search?email=${user.email}`)
        .then((res) => {
          if (res.data) {
            setProfileData(res.data);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user profile for navbar", err);
        });
    }
  }, [user, axiosSecure]);

  const handleSignOut = () => {       
    logOut()
      .then(() => {
        console.log('User signed out');
      })
      .catch(error => {
        console.error('Sign out error:', error);
      });
  };

  const navItems = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/aboutUs">About Us</NavLink></li>
      <li><NavLink to="/availableCamps">Available Camps</NavLink></li>
      <li><NavLink to="/beAOrganizer">Be A Organizer</NavLink></li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 md:px-8 lg:px-12">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            {navItems}
          </ul>
        </div>
        <MediCareLogo />
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2">
          {navItems}
        </ul>
      </div>

      <div className="navbar-end gap-2 sm:gap-3">
        {user ? (
          <>
            <div className="relative group">
              <img
                src={
                  profileData?.image
                    ? profileData.image
                    : user?.photoURL
                      ? user.photoURL
                      : "https://i.ibb.co/2kRZKmW/default-avatar.png"
                }
                alt="Profile"
                className="w-10 h-10 min-w-10 rounded-full border-2 border-blue-500 cursor-pointer"
              />
              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-10">
                {profileData?.name || profileData?.participantName || user?.displayName || "Anonymous"}
              </div>
            </div>

            <NavLink to="/dashboard" className='btn text-blue-800 bg-purple-200 text-sm px-3'>
              My DashBoard
            </NavLink>

            <button
              onClick={handleSignOut}
              className="btn text-white bg-red-700 ml-1 text-sm px-3"
            >
              SignOut
            </button>
          </>
        ) : (
          <>
            <NavLink className="btn bg-blue-900 text-white text-sm px-3" to="/register">
              Register
            </NavLink>
            <NavLink className="btn bg-blue-900 text-white text-sm px-3" to="/login">
              Login
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
