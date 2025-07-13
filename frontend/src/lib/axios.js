import axios from "axios";

const BASE_URL = "https://streamify-u9ti.onrender.com/api/v1"

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});