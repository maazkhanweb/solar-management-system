import axios from "axios";

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,

    timeout: 120000,

    headers: {
        Accept: "application/json",

        /*
        IMPORTANT:
        Do NOT force Content-Type: application/json globally.

        Normal JSON requests will automatically receive the correct
        content type from Axios.

        FormData requests must be allowed to use:
        multipart/form-data; boundary=...
        */
    },
});

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
    (config) => {
        /*
        ---------------------------------------------------------------
        | Authentication Token
        ---------------------------------------------------------------
        */

        const token =
            localStorage.getItem("token") ||
            sessionStorage.getItem("token");

        if (token) {
            config.headers = config.headers || {};

            config.headers.Authorization = `Bearer ${token}`;
        }

        /*
        ---------------------------------------------------------------
        | FormData Detection
        ---------------------------------------------------------------
        |
        | File uploads such as:
        |
        | /comparison/process-ocr
        |
        | use FormData.
        |
        | We MUST remove application/json so the browser/Axios can
        | automatically generate:
        |
        | multipart/form-data; boundary=...
        |
        ---------------------------------------------------------------
        */

        if (config.data instanceof FormData) {
            if (config.headers) {
                delete config.headers["Content-Type"];
                delete config.headers["content-type"];
            }
        }

        /*
        ---------------------------------------------------------------
        | Normal JSON Requests
        ---------------------------------------------------------------
        |
        | For normal objects, Axios will handle JSON serialization.
        |
        ---------------------------------------------------------------
        */

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        /*
        ---------------------------------------------------------------
        | API Error Logging
        ---------------------------------------------------------------
        */

        console.group("API ERROR");

        console.log(
            "URL:",
            error.config?.url
        );

        console.log(
            "METHOD:",
            error.config?.method
        );

        console.log(
            "STATUS:",
            error.response?.status
        );

        console.log(
            "DATA:",
            error.response?.data
        );

        console.log(
            "MESSAGE:",
            error.message
        );

        console.groupEnd();

        /*
        ---------------------------------------------------------------
        | Authentication Error
        ---------------------------------------------------------------
        */

        const status =
            error.response?.status;

        const url =
            error.config?.url || "";

        if (
            status === 401 &&
            !url.includes("/login")
        ) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("rememberMe");

            sessionStorage.removeItem("token");

            window.location.replace("/");
        }

        return Promise.reject(error);
    }
);

export default api;