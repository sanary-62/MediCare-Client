import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: `https://medicare-server-eight.vercel.app`
});

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;



