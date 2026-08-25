import { useAuth } from "../contexts/AuthContext";

const useAuthentication = () => {

    return useAuth();

};

export default useAuthentication;