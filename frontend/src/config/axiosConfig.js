import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
    timeout: 10000,
});

api.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default api;