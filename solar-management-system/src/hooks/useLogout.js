import { useNavigate } from "react-router-dom";

function useLogout() {

    const navigate = useNavigate();

    const logout = () => {

        // Future:
        // localStorage.removeItem("token");
        // localStorage.removeItem("user");

        localStorage.clear();

        navigate("/");

    };

    return logout;

}

export default useLogout;