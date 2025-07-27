import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: `https://medicare-server-8b0q3y0hd-sanary-62s-projects.vercel.app/`
});

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;



