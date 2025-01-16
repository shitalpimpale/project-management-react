import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:3500/', // Your backend API base URL
});

//Add token to api call
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        console.log(config.headers)
    } else {
        localStorage.clear();
        localStorage.removeItem("persist:root");
        window.location.href = "/login";
    }

    return config;
});
export default API;
