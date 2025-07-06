import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "https://e-commerce-website-9g4o.onrender.com/api",
    withCredentials: true
});

export default axiosInstance;