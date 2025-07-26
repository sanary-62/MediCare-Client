// import axios from 'axios';
// import useAuth from './useAuth';
// import { useNavigate } from 'react-router';

// const axiosSecure = axios.create({
//   baseURL: `http://localhost:5000/`,
// });

// const useAxiosSecure = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   axiosSecure.interceptors.request.use(
//     (config) => {
//       if (user?.accessToken) {
//         config.headers.Authorization = `Bearer ${user.accessToken}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   axiosSecure.interceptors.response.use(
//   (res) => {
//     return res;
//   },
//   (error) => {
//     console.log('inside res interceptors ', error.response?.status);
//     const status = error.response?.status;
//     if (status === 403) {
//       navigate('/dashboard');  
//     } else if (status === 401) {
//       logout()
//         .then(() => {
//           navigate('/login');
//         })
//         .catch(() => {});
//     }

//     return Promise.reject(error);
//   }
// );


//   return axiosSecure;
// };

// export default useAxiosSecure;








import axios from 'axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';
import { getIdToken } from 'firebase/auth';

const axiosSecure = axios.create({
  baseURL: `http://localhost:5000/`,
});

const useAxiosSecure = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  axiosSecure.interceptors.request.use(
    async (config) => {
      if (user) {
        try {
          const token = await getIdToken(user);
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.error('Failed to get Firebase token', error);
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosSecure.interceptors.response.use(
    (res) => res,
    (error) => {
      console.log('inside res interceptors ', error.response?.status);
      const status = error.response?.status;
      if (status === 403) {
        navigate('/dashboard');
      } else if (status === 401) {
        logout()
          .then(() => {
            navigate('/login');
          })
          .catch(() => {});
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;

