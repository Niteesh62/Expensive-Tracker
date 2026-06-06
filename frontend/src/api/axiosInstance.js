import axios from "axios";

const API_BASE_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:8000/api";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

/* Request Interceptor */
axiosInstance.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("authToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* Response Interceptor */
axiosInstance.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status;

        switch (status) {
            case 401:
                localStorage.removeItem("authToken");
                window.location.href = "/401";
                break;

            case 403:
                window.location.href = "/403";
                break;

            case 500:
                console.error("Server Error");
                break;

            default:
                console.error("Unexpected Error");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;