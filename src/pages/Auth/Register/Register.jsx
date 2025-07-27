import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom";
import useAuth from '../../../hooks/useAuth';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAxiosSecure from '../../../hooks/useAxios';
 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createUser } = useAuth();
  const axiosInstance = useAxiosSecure();

  const onSubmit = async (data) => {
    console.log(data);

    try {
      const result = await createUser(data.email, data.password);
      await result.user.reload(); 
      console.log(result.user);

      const userInfo = {
        email: data.email,
        photo: data.photo,
        role: 'user',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };

      const userRes = await axiosInstance.post('/users', userInfo);
      console.log(userRes.data);

      onAuthStateChanged(getAuth(), (currentUser) => {
        if (currentUser) {
          navigate('/');
        }
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className='text-5xl mb-4 text-blue-800 font-bold text-center'>Register Now!</h1>
        <fieldset className="fieldset space-y-4">
          <label className="label block font-semibold">Name</label>
          <input
            type="text"
            {...register('name', { required: true })}
            className="input w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Name"
          />
          {errors.name?.type === 'required' && <p className='text-red-600'>Name is required</p>}

          <label className="label block font-semibold">Email</label>
          <input
            type="email"
            {...register('email', {
              required: true,
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address"
              }
            })}
            className="input w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Email"
          />
          {errors.email?.type === 'required' && <p className='text-red-600'>Email is required</p>}
          {errors.email?.type === 'pattern' && <p className='text-red-600'>{errors.email.message}</p>}

          <label className="label block font-semibold">Photo URL</label>
          <input
            type="text"
            {...register('photo', { required: true })}
            className="input w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Photo URL"
          />
          {errors.photo?.type === 'required' && <p className='text-red-600'>Photo URL is required</p>}

          <label className="label block font-semibold">Password</label>
          <input
            type="password"
            {...register('password', { required: true, minLength: 6 })}
            className="input w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Password"
          />
          {errors.password?.type === 'required' && <p className='text-red-600'>Password is required</p>}
          {errors.password?.type === 'minLength' && <p className='text-red-600'>Password must be 6 characters or longer</p>}

          <label className="label block font-semibold">Confirm password</label>
          <input
            type="password"
            {...register('confirmPassword', { required: true })}
            className="input w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Confirm password"
          />
          {errors.confirmPassword?.type === 'required' && <p className='text-red-600'>Confirm password is required</p>}

          <div className="text-center">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="link link-hover text-blue-700"> Login </Link>
            </p>
          </div>

          <button className="btn w-full bg-blue-800 text-white mt-4 py-2 rounded-md hover:bg-blue-900 transition">
            Register
          </button>
        </fieldset>
        <div className="mt-6">
          <SocialLogin />
        </div>
      </form>
    </div>
  );
};

export default Register;
