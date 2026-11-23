
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Users,
    UserRound,
    AtSign,
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
import "./Register.css";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        setError("");

        if (
            !formData.fullName.trim() ||
            !formData.username.trim() ||
            !formData.email.trim() ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError("Please fill in all the fields.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(`${API_URL}/auth/register`, {
                fullName: formData.fullName.trim(),
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });

            const { user, token } = response.data;

            if (!user || !token) {
                throw new Error("Invalid registration response from server.");
            }

            login(user, token);
            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <section className="auth-brand-panel">
                <Link to="/register" className="auth-brand-logo">
                    <span className="auth-logo-icon">
                        <Users size={25} />
                    </span>
                    <span>Connectly</span>
                </Link>

                <div className="auth-brand-content">
                    <span className="auth-brand-tag">
                        BE PART OF SOMETHING SOCIAL
                    </span>

                    <h1>
                        Your people.
                        <br />
                        <span>Your community.</span>
                    </h1>

                    <p>
                        Create your account and become part of a growing community.
                        Share updates, discover people, and build meaningful connections.
                    </p>

                    <div className="auth-feature-list">
                        <div className="auth-feature-item">
                            <span><UserRound size={19} /></span>
                            <div>
                                <strong>Create your identity</strong>
                                <small>Build a profile that represents you.</small>
                            </div>
                        </div>

                        <div className="auth-feature-item">
                            <span><MessageCircle size={19} /></span>
                            <div>
                                <strong>Join conversations</strong>
                                <small>
                                    Share your thoughts and interact with others.
                                </small>
                            </div>
                        </div>

                        <div className="auth-feature-item">
                            <span><Globe size={19} /></span>
                            <div>
                                <strong>Discover new connections</strong>
                                <small>
                                    Find people and grow your community.
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
                <div className="auth-card register-card">
                    <Link to="/register" className="auth-mobile-logo">
                        <span className="auth-logo-icon">
                            <Users size={22} />
                        </span>
                        Connectly
                    </Link>

                    <div className="auth-heading">
                        <span className="auth-heading-tag">GET STARTED</span>
                        <h2>Create your account</h2>
                        <p>Join Connectly and start building connections.</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label htmlFor="fullName">Full Name</label>

                            <div className="input-wrapper">
                                <UserRound size={18} />
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="username">Username</label>

                            <div className="input-wrapper">
                                <AtSign size={18} />
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    autoComplete="username"
                                    required
                                />
                            </div>
                        </div>

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
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
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

                            <small className="auth-input-hint">
                                Use at least 6 characters.
                            </small>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>

                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type={
                                        showConfirmPassword ? "text" : "password"
                                    }
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Re-enter your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showConfirmPassword ? (
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
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>ALREADY A MEMBER?</span>
                    </div>

                    <p className="auth-footer">
                        Already have an account?
                        <Link to="/login"> Sign In</Link>
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

export default Register;
