import axios from "axios";
import dayjs from 'dayjs'
import { jwtDecode } from 'jwt-decode';



const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;
const useAxios = () => {
  const access_token =  localStorage.getItem("access_token")
    const axiosInstance = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      headers: { Authorization: `Bearer ${access_token}` }
  });


 
    axiosInstance.interceptors.request.use(async req => {
      
      let access_token =  localStorage.getItem("access_token")  
      const refresh_token =  localStorage.getItem("refresh_token")  
      if(!access_token){
        access_token = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null
        req.headers.Authorization = `Bearer ${access_token}`
      }

      const user = jwtDecode(access_token)
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
      if(!isExpired) return req 

      const response = await axios.post(`${BASE_URL}/api/token/refersh/`, {
        refresh: refresh_token
      });
     
  
      
      localStorage.setItem("access_token", response.data.access);
      // localStorage.setItem("refresh_token", response.data.refresh);
      req.headers.Authorization = `Bearer ${response.data.access}`
      return req


  })
  return axiosInstance


}


export default useAxios







  // axiosInstance.interceptors.response.use(
  //   (response) => response,
  //   async (error) => {
  //     console.log('axios instance intercepts response');
  //     if (error.response.status === 401 && !refresh) {
  //       refresh = true;
  //       console.log(localStorage.getItem("refresh_token"));
  //       try {
  //         const refreshResponse = await axios.post(
  //           `${BASE_URL}/api/token/refresh/`,
  //           {
  //             refresh: localStorage.getItem("refresh_token"),
  //           },
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             withCredentials: true,
  //           }
  //         );
  
  //         if (refreshResponse.status === 200) {
  //           axiosInstance.defaults.headers.common[
  //             "Authorization"
  //           ] = `Bearer ${refreshResponse.data["access"]}`;
  //           localStorage.setItem("access_token", refreshResponse.data.access);
  //           localStorage.setItem("refresh_token", refreshResponse.data.refresh);
  
  //           return axiosInstance(error.config);
  //         }
  //       } catch (refreshError) {
  //         console.error("Error refreshing token:", refreshError);
  //         throw refreshError;
  //       } finally {
  //         refresh = false;
  //       }
  //     }
  
  //     return Promise.reject(error);
  //   }
  // );
  
  // return axiosInstance;
  // };