import api from "./api";

const authService = {

    // ==========================================
    // Authentication
    // ==========================================

    login: async (credentials) => {

        const response = await api.post(

            "/login",

            credentials

        );

        // Don't save anything here.
        // AuthContext will decide where to save
        // based on Remember Me.

        return response.data;

    },

    getCurrentUser: async () => {

        const response = await api.get("/me");

        return response.data;

    },

    logout: async () => {

        const response = await api.post("/logout");

        return response.data;

    },

    // ==========================================
    // User Management
    // ==========================================

    getUsers: async () => {

        const response = await api.get("/users");

        return response.data;

    },

    /**
     * User Dropdown Options
     */
    getUserOptions: async () => {

        const response = await api.get("/users/options");

        return response.data;

    },

    createUser: async (userData) => {

        const response = await api.post(

            "/users",

            userData,

            {

                headers: {

                    "Content-Type": "multipart/form-data",

                },

            }

        );

        return response.data;

    },

    updateUser: async (id, userData) => {

        const response = await api.post(

            `/users/${id}?_method=PUT`,

            userData,

            {

                headers: {

                    "Content-Type": "multipart/form-data",

                },

            }

        );

        return response.data;

    },

    deleteUser: async (id) => {

        const response = await api.delete(

            `/users/${id}`

        );

        return response.data;

    },

    // ==========================================
    // Area Management
    // ==========================================

    getAreas: async () => {

        const response = await api.get("/areas");

        return response.data;

    },

    /**
     * Area Dropdown Options
     */
    getAreaOptions: async () => {

        const response = await api.get("/areas/options");

        return response.data;

    },

    createArea: async (areaData) => {

        const response = await api.post(

            "/areas",

            areaData

        );

        return response.data;

    },

    updateArea: async (id, areaData) => {

        const response = await api.put(

            `/areas/${id}`,

            areaData

        );

        return response.data;

    },

    deleteArea: async (id) => {

        const response = await api.delete(

            `/areas/${id}`

        );

        return response.data;

    },

    moveAreaToInventory: async (id) => {

        const response = await api.put(

            `/areas/${id}/move-to-inventory`

        );

        return response.data;

    },

    /**
 * Get Area Assets
 */
getAreaAssets: async (id) => {

    const response = await api.get(

        `/areas/${id}/assets`

    );

    return response.data;

},
        // ==========================================
    // Inverter Management
    // ==========================================

    getInverters: async () => {

        const response = await api.get("/inverters");

        return response.data;

    },

    createInverter: async (inverterData) => {

        const response = await api.post(

            "/inverters",

            inverterData

        );

        return response.data;

    },

    updateInverter: async (id, inverterData) => {

        const response = await api.put(

            `/inverters/${id}`,

            inverterData

        );

        return response.data;

    },

    deleteInverter: async (id) => {

        const response = await api.delete(

            `/inverters/${id}`

        );

        return response.data;

    },

    // ==========================================
    // Solar Panel Management
    // ==========================================

    getSolarPanels: async () => {

        const response = await api.get("/solar-panels");

        return response.data;

    },

    createSolarPanel: async (solarPanelData) => {

        const response = await api.post(

            "/solar-panels",

            solarPanelData

        );

        return response.data;

    },

    updateSolarPanel: async (id, solarPanelData) => {

        const response = await api.put(

            `/solar-panels/${id}`,

            solarPanelData

        );

        return response.data;

    },

    deleteSolarPanel: async (id) => {

        const response = await api.delete(

            `/solar-panels/${id}`

        );

        return response.data;

    },

    // ==========================================
    // Battery Management
    // ==========================================

    getBatteries: async () => {

        const response = await api.get("/batteries");

        return response.data;

    },

    createBattery: async (batteryData) => {

        const response = await api.post(

            "/batteries",

            batteryData

        );

        return response.data;

    },

    updateBattery: async (id, batteryData) => {

        const response = await api.put(

            `/batteries/${id}`,

            batteryData

        );

        return response.data;

    },

    deleteBattery: async (id) => {

        const response = await api.delete(

            `/batteries/${id}`

        );

        return response.data;

    },

    // ==========================================
    // Local Storage Helpers
    // ==========================================

    getToken: () => {

        return (

            localStorage.getItem("token") ||

            sessionStorage.getItem("token")

        );

    },

    getUser: () => {

        const user =

            localStorage.getItem("user") ||

            sessionStorage.getItem("user");

        return user

            ? JSON.parse(user)

            : null;

    },

    isAuthenticated: () => {

        return !!(

            localStorage.getItem("token") ||

            sessionStorage.getItem("token")

        );

    },

    clearAuth: () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

    },

};

export default authService;