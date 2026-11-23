
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Users,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    MessageCircle,
    Globe,
    LoaderCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./Login.css";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email.trim() || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.post(`${API_URL}/auth/login`, {
                email: formData.email.trim(),
                password: formData.password,
            });

            const { user, token } = response.data;

            if (!user || !token) {
                throw new Error("Invalid login response from server.");
            }

            login(user, token);
            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <section className="auth-brand-panel">
                <Link to="/login" className="auth-brand-logo">
                    <span className="auth-logo-icon">
                        <Users size={25} />
                    </span>
                    <span>Connectly</span>
                </Link>

                <div className="auth-brand-content">
                    <span className="auth-brand-tag">
                        YOUR COMMUNITY. YOUR SPACE.
                    </span>

                    <h1>
                        Connect with people.
                        <br />
                        <span>Share your world.</span>
                    </h1>

                    <p>
                        A place to build meaningful connections, share your thoughts,
                        discover new people, and stay connected with your community.
                    </p>

                    <div className="auth-feature-list">
                        <div className="auth-feature-item">
                            <span><MessageCircle size={19} /></span>
                            <div>
                                <strong>Share your thoughts</strong>
                                <small>
                                    Express yourself through posts and conversations.
                                </small>
                            </div>
                        </div>

                        <div className="auth-feature-item">
                            <span><Globe size={19} /></span>
                            <div>
                                <strong>Discover your community</strong>
                                <small>
                                    Explore profiles and connect with new people.
                                </small>
                            </div>
                        </div>

                        <div className="auth-feature-item">
                            <span><ShieldCheck size={19} /></span>
                            <div>
                                <strong>Your personal space</strong>
                                <small>
                                    Manage your profile and connections.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-brand-footer">
                    © 2026 Connectly. Made for meaningful connections.
                </div>
            </section>

            <section className="auth-form-panel">
                <div className="auth-card">
                    <Link to="/login" className="auth-mobile-logo">
                        <span className="auth-logo-icon">
                            <Users size={22} />
                        </span>
                        Connectly
                    </Link>

                    <div className="auth-heading">
                        <span className="auth-heading-tag">WELCOME BACK</span>
                        <h2>Sign in to Connectly</h2>
                        <p>Enter your details to access your account.</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label htmlFor="email">Email Address</label>

                            <div className="input-wrapper">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">Password</label>

                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={
                                        showPassword ? "Hide password" : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle
                                        className="auth-loading-icon"
                                        size={19}
                                    />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>NEW TO CONNECTLY?</span>
                    </div>

                    <p className="auth-footer">
                        Don't have an account?
                        <Link to="/register"> Create Account</Link>
                    </p>

                    <div className="auth-security-note">
                        <ShieldCheck size={16} />
                        <span>Your account is protected and secure.</span>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Login;
