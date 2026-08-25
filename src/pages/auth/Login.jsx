import "./Login.css";

import { useEffect, useState } from "react";
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

    useEffect(() => {

        const remember = localStorage.getItem("rememberMe");

        const savedEmail = localStorage.getItem("rememberedEmail");

        if (remember === "true" && savedEmail) {

            setRememberMe(true);

            setEmail(savedEmail);

        }

    }, []);

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