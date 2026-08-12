import { useTheme as useThemeContext } from "../contexts/ThemeContext";

const useTheme = () => {

    return useThemeContext();

};

export default useTheme;