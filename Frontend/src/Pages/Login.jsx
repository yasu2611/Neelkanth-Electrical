import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    getCurrentUser,
    setCurrentUser
} from "../utils/auth";
import { loginUser } from "../utils/api";
import { mergeGuestCartOnLogin } from "../utils/cart";
import './Home.css';

function Login() {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const currentUser = getCurrentUser();

        if (currentUser) {
            if (currentUser.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        }
    }, [navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setMessage("");

        if (!query || !password) {
            setMessage("Enter your username/email and password.");
            return;
        }

        setLoading(true);

        try {
            const user = await loginUser({
                query,
                password
            });

            setCurrentUser(user);

            // Fold any items added while browsing as a guest into the real cart.
            try {
                await mergeGuestCartOnLogin();
            } catch (mergeErr) {
                console.error("Cart merge failed:", mergeErr);
            }

            setLoading(false);

            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            setLoading(false);
            setMessage(error.message || "Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title"> Login</h1>
                <p className="login-subtitle">
                    Sign in to access dashboard
                </p>

                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="text"
                        placeholder="Username or Email"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="login-input"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />

                    {message && (
                        <div className="login-message">{message}</div>
                    )}

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <p className="login-register-text">
                    Don't have an account? <Link to="/register">Create Account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;