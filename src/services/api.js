
import axios from "axios";

const DEFAULT_TIMEOUT = 30000;
const UPLOAD_TIMEOUT = 120000;

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
        Accept: "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("token") ||
            sessionStorage.getItem("token");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        const isFormData =
            typeof FormData !== "undefined" &&
            config.data instanceof FormData;

        if (isFormData) {
            // File uploads can take longer than normal API requests.
            config.timeout = UPLOAD_TIMEOUT;

            // Let the browser set the multipart boundary.
            if (config.headers) {
                delete config.headers["Content-Type"];
                delete config.headers["content-type"];
            }
        } else if (!config.timeout || config.timeout === UPLOAD_TIMEOUT) {
            config.timeout = DEFAULT_TIMEOUT;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (import.meta.env.DEV) {
            console.error("API request failed:", {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                message: error.message,
            });
        }

        const status = error.response?.status;
        const url = error.config?.url || "";

        if (status === 401 && !url.includes("/login")) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("rememberMe");
            sessionStorage.removeItem("token");

            if (window.location.pathname !== "/") {
                window.location.replace("/");
            }
        }

        return Promise.reject(error);
    }
);

export default api;
