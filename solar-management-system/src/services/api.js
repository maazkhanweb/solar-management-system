import axios from "axios";

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

const api = axios.create({

    baseURL:

        import.meta.env.VITE_API_URL,

    timeout: 120000,

    headers: {

        Accept: "application/json",

        "Content-Type": "application/json",

    },

});

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(

    (config) => {

        const token =

            localStorage.getItem("token") ||

            sessionStorage.getItem("token");

        if (token) {

            config.headers.Authorization =

                `Bearer ${token}`;

        }

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

        console.group("API ERROR");

        console.log("URL:", error.config?.url);

        console.log("METHOD:", error.config?.method);

        console.log("STATUS:", error.response?.status);

        console.log("DATA:", error.response?.data);

        console.log("MESSAGE:", error.message);

        console.groupEnd();

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