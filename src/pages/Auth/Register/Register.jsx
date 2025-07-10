import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";
import useAuth from '../../../hooks/useAuth';
import SocialLogin from '../SocialLogin/SocialLogin';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
     const {register , handleSubmit, formState:{errors}} = useForm();
    const {createUser} = useAuth();

        const onSubmit = data => {
            console.log (data);
            createUser(data.email, data.password)
            .then (result => {
                console.log(result.user);
                 navigate('/');
            })
            .catch (error =>{
                console.error (error);
            })
        }

        

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className='text-5xl mb-4 text-blue-800 font-bold'>Register Now!</h1>
            <fieldset className="fieldset">
          
          <label className="label"> Name</label>
          <input type="text" {...register('name', {required:true})} className="input" placeholder="Name" />
          {
            errors.name?.type === 'required' && 
            <p className='text-red-600'>Name is required</p>
          }

          <label className="label">Email</label>
          <input type="email" {...register('email', {required:true})} className="input" placeholder="Email" />
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

          <label className="label">Confirm password</label>
          <input type="password" {...register('confirmPassword', {required:true})} className="input" placeholder="Confirm password" />
          {
            errors.confirmPassword?.type === 'required' && 
            <p className='text-red-600'>Confirm password is required</p>
          }
          <div>
            <p>
                 
                    Already have an account?
                    <Link
                    to="/login"
                    className="link link-hover text-blue-700 "
                  >
                     Login
                  </Link>
                  
                  </p>
          </div>

          <button className="btn bg-blue-800 text-white mt-4">Register</button>
        </fieldset>
        <SocialLogin></SocialLogin>
        </form>
    );
};

export default Register;
