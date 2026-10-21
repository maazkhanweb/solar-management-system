import "./Login.css";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    RiMailLine,
    RiLockPasswordLine,
    RiEyeLine,
    RiEyeOffLine,
    RiCheckboxCircleFill,
    RiBarChartBoxLine,
    RiShieldCheckLine,
    RiFileChartLine,
    RiFlashlightLine,
} from "react-icons/ri";

import Logo from "../../components/common/Logo/Logo";

import loginBackground from "../../assets/images/login-bg.png";

import useAuthentication from "../../hooks/useAuth";
import authService from "../../services/authService";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuthentication();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [rememberMe, setRememberMe] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const googleButtonRef = useRef(null);

    useEffect(() => {

        const remember = localStorage.getItem("rememberMe");

        const savedEmail = localStorage.getItem("rememberedEmail");

        if (remember === "true" && savedEmail) {

            setRememberMe(true);

            setEmail(savedEmail);

        }

    }, []);

    useEffect(() => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId || !googleButtonRef.current) return undefined;

        let cancelled = false;
        const initializeGoogle = () => {
            if (cancelled || !window.google?.accounts?.id || !googleButtonRef.current) return;
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: async ({ credential }) => {
                    if (!credential) return;
                    try {
                        setGoogleLoading(true);
                        const response = await authService.googleLogin(credential);
                        login(response.user, response.token, true);
                        navigate("/dashboard", { replace: true });
                    } catch (error) {
                        alert(error.response?.data?.message || "Google sign-in failed.");
                    } finally {
                        setGoogleLoading(false);
                    }
                },
            });
            googleButtonRef.current.innerHTML = "";
            window.google.accounts.id.renderButton(googleButtonRef.current, {
                type: "standard", theme: "outline", size: "large",
                text: "continue_with", shape: "rectangular", width: 320,
            });
        };

        if (window.google?.accounts?.id) {
            initializeGoogle();
        } else {
            const existing = document.querySelector('script[data-google-identity="true"]');
            if (existing) {
                existing.addEventListener("load", initializeGoogle, { once: true });
            } else {
                const script = document.createElement("script");
                script.src = "https://accounts.google.com/gsi/client";
                script.async = true;
                script.defer = true;
                script.dataset.googleIdentity = "true";
                script.onload = initializeGoogle;
                document.head.appendChild(script);
            }
        }
        return () => { cancelled = true; };
    }, [login, navigate]);

    const handleLogin = async () => {

        if (loading) return;

        if (!email.trim()) {

            alert("Please enter your email.");

            return;

        }

        if (!password.trim()) {

            alert("Please enter your password.");

            return;

        }

        try {

            setLoading(true);

            const response = await authService.login({

                email: email.trim(),

                password,

            });

            login(

                response.user,

                response.token,

                rememberMe

            );

            if (rememberMe) {

                localStorage.setItem(
                    "rememberMe",
                    "true"
                );

                localStorage.setItem(
                    "rememberedEmail",
                    email.trim()
                );

            } else {

                localStorage.removeItem("rememberMe");

                localStorage.removeItem("rememberedEmail");

            }

            navigate("/dashboard");

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Login failed.";

            alert(message);

        } finally {

            setLoading(false);

        }

    };

    const handleKeyDown = (event) => {

        if (event.key === "Enter") {

            handleLogin();

        }

    };

    return (

        <div
            className="login-page"
            style={{
                backgroundImage: `url(${loginBackground})`,
            }}
        >
                        <div className="login-overlay">

                {/* ===========================
                    LEFT SIDE
                =========================== */}

                <div className="login-left">

                    <Logo />

                    <div className="login-left-content">

                        <h1>

                            Smarter Monitoring.

                            <br />

                            <span>

                                Better Tomorrow.

                            </span>

                        </h1>

                        <p>

                            Monitor, analyze and optimize your
                            solar energy systems with intelligent
                            insights.

                        </p>

                        <div className="feature-list">

                            <div className="feature-item">

                                <RiBarChartBoxLine />

                                <div>

                                    <h4>

                                        Real-time Monitoring

                                    </h4>

                                    <span>

                                        Live data and performance
                                        tracking

                                    </span>

                                </div>

                            </div>

                            <div className="feature-item">

                                <RiFlashlightLine />

                                <div>

                                    <h4>

                                        Smart Analytics

                                    </h4>

                                    <span>

                                        AI-powered insights and
                                        reports

                                    </span>

                                </div>

                            </div>

                            <div className="feature-item">

                                <RiFileChartLine />

                                <div>

                                    <h4>

                                        Detailed Reports

                                    </h4>

                                    <span>

                                        Generate and export
                                        professional reports

                                    </span>

                                </div>

                            </div>

                            <div className="feature-item">

                                <RiShieldCheckLine />

                                <div>

                                    <h4>

                                        Secure & Reliable

                                    </h4>

                                    <span>

                                        Your data is always safe
                                        with us

                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ===========================
                    RIGHT SIDE
                =========================== */}

                <div className="login-right">

                    <div className="login-card">

                        <div className="login-card-logo">

                            ☀

                        </div>

                        <h2>

                            Welcome Back 👋

                        </h2>

                        <p>

                            Sign in to continue to your account

                        </p>
                                                <div className="input-group">

                            <label>

                                Email Address

                            </label>

                            <div className="input-box">

                                <RiMailLine className="input-icon" />

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                />

                            </div>

                        </div>

                        <div className="input-group">

                            <label>

                                Password

                            </label>

                            <div className="input-box">

                                <RiLockPasswordLine
                                    className="input-icon"
                                />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={handleKeyDown}
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >

                                    {

                                        showPassword

                                            ? <RiEyeOffLine />

                                            : <RiEyeLine />

                                    }

                                </button>

                            </div>

                        </div>

                        <div className="login-options">

                            <label className="remember-me">

                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={() =>
                                        setRememberMe(
                                            !rememberMe
                                        )
                                    }
                                />

                                Remember Me

                            </label>

                        </div>

                        <button
                            className="login-btn"
                            onClick={handleLogin}
                            disabled={loading}
                        >

                            {

                                loading

                                    ? "Signing In..."

                                    : "Login"

                            }

                        </button>

                        <div className="google-signin-divider"><span>OR</span></div>
                        {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                            <div className="google-signin-wrap">
                                <div ref={googleButtonRef} className="google-signin-button" />
                                {googleLoading && <p className="google-signin-status">Signing in with Google...</p>}
                            </div>
                        ) : (
                            <p className="google-signin-config-note">Google sign-in is not configured yet.</p>
                        )}

                        <div className="login-footer">

                            <span>

                                Secure • Reliable • Efficient

                            </span>

                        </div>
                                            </div>

                </div>

            </div>

        </div>

    );

}

export default Login;