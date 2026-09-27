import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(

    <BrowserRouter>

        <ThemeProvider>

            <AuthProvider>

                <App />

            </AuthProvider>

        </ThemeProvider>

    </BrowserRouter>

);