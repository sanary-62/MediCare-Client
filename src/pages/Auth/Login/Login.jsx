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

    navigate("/"); // go to home or dashboard
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
        
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className='text-5xl mb-4 text-blue-800 font-bold'>Login Now!</h1>
            <fieldset className="fieldset">
          <label className="label">Email</label>
          <input type="email" {...register('email')} className="input" placeholder="Email" />
          {
            errors.email?.type === 'required' && 
            <p className='text-red-600'>Email is required</p>
          }
          <label className="label">Password</label>
          <input type="password" {...register('password', {required:true, minLength: 6,})} className="input" placeholder="Password" />
          {
            errors.password?.type === 'required' && 
            <p className='text-red-600'>Password is required</p>
          }
          {
            errors.password?.type === 'minLength' && 
            <p className='text-red-600'>Password must be 6 characters or longer</p>
          }
          <div>
             <p>
                              
                                 Do not have an account? 
                                 <Link
                                 to="/register"
                                 className="link link-hover text-blue-700 "
                               >
                                   Register
                               </Link>
                               
                               </p>
          </div>
          <button className="btn bg-blue-800 text-white mt-4">Login</button>
         
        </fieldset>
        <SocialLogin></SocialLogin>
        </form>
    );
};

export default Login;