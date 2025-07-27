import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import SocialLogin from '../SocialLogin/SocialLogin';
import { auth } from "../../../firebase/firebase.init"; 
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const navigate = useNavigate();

    const {register , handleSubmit, formState:{errors}} = useForm();

   const onSubmit = async (data) => {
      const { email, password } = data;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Logged in as:", user.email);

        navigate("/");
      } catch (error) {
        console.error("Login error:", error.message);

        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: error.message,
        });
      }
    };

    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h1 className='text-5xl mb-4 text-blue-800 font-bold text-center'>Login Now!</h1>
            <fieldset className="fieldset space-y-4">
              <label className="label block font-semibold">Email</label>
              <input
                type="email"
                {...register('email')}
                className="input w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Email"
              />
              {errors.email?.type === 'required' && (
                <p className='text-red-600'>Email is required</p>
              )}

              <label className="label block font-semibold">Password</label>
              <input
                type="password"
                {...register('password', {required:true, minLength: 6})}
                className="input w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Password"
              />
              {errors.password?.type === 'required' && (
                <p className='text-red-600'>Password is required</p>
              )}
              {errors.password?.type === 'minLength' && (
                <p className='text-red-600'>Password must be 6 characters or longer</p>
              )}

              <div className="text-center">
                 <p>
                   Do not have an account?{" "}
                   <Link to="/register" className="link link-hover text-blue-700">
                     Register
                   </Link>
                 </p>
              </div>

              <button className="btn w-full bg-blue-800 text-white mt-4 py-2 rounded-md hover:bg-blue-900 transition">
                Login
              </button>
            </fieldset>

            <div className="mt-6">
              <SocialLogin />
            </div>
        </form>
      </div>
    );
};

export default Login;
