import React from 'react';
import { Outlet } from 'react-router';
import Lottie from "lottie-react";
import LoginAnimation from "../assets/Lotties/Login.json"

const AuthLayout = () => {
    return (
        <div className="hero min-h-screen">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <Lottie className='h-2/6 w-2/6' animationData={LoginAnimation} loop={true} />
    <div>
      <Outlet></Outlet>
    </div>
  </div>
</div>
    );
};

export default AuthLayout;