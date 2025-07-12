import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "/api" : "https://e-commerce-website-9g4o.onrender.com/api",
    withCredentials: true
});

export default axiosInstance;