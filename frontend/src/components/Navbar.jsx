
import { Link, useNavigate } from "react-router-dom";
import {
    Home,
    Search,
    User,
    LogOut,
    MessageCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">
                <MessageCircle size={27} />
                <span>Connectly</span>
            </Link>

            <div className="nav-links">
                <Link to="/">
                    <Home size={20} />
                    Home
                </Link>

                <Link to="/explore">
                    <Search size={20} />
                    Explore
                </Link>

                {user && (
                    <Link to={`/profile/${user.id || user._id}`}>
                        <User size={20} />
                        Profile
                    </Link>
                )}
            </div>

            <div className="nav-user">
                {user && <span>@{user.username}</span>}

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
