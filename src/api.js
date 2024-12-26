import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:3500/', // Your backend API base URL
});

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
// API.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error) => {
//         console.log("error", error)
//         if (
//             (error && error.message === 'Request failed with status code 403')
//         ) {
//             localStorage.clear();
//             window.location.href = "/login";
//         }
//         return Promise.reject(error);
//     }
// );
export default API;
