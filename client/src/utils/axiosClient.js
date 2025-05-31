import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_GATEWAY_URL,
  withCredentials: true
});

export default axiosClient;