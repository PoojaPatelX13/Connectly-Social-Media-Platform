
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Home,
    Compass,
    UserRound,
    Users,
    Search,
    Sun,
    Moon,
    Bell,
    LogOut,
    Sparkles,
    UserPlus,
    UserCheck,
    MapPin,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./Explore.css";

const API_URL = "http://localhost:5000/api";

function Explore({ theme, toggleTheme }) {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [followingIds, setFollowingIds] = useState([]);

    const userId = user?._id || user?.id;
    const name = user?.name || user?.fullName || user?.username || "User";
    const avatar = user?.profilePicture || user?.avatar || "";

    const initials = name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        searchUsers("");
    }, []);

    const searchUsers = async (query) => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/profiles/search?q=${encodeURIComponent(query)}`,
                { headers }
            );

            const data =
                response.data?.profiles ||
                response.data?.users ||
                response.data?.data ||
                response.data;

            const list = Array.isArray(data) ? data : [];

            setUsers(
                list.filter((item) => {
                    const id = item?._id || item?.id;
                    return String(id) !== String(userId);
                })
            );
        } catch (err) {
            console.error("User search error:", err);
            setUsers([]);
            setError(
                err.response?.data?.message ||
                "Unable to find users. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        searchUsers(search.trim());
    };

    const handleFollow = async (targetId) => {
        try {
            const isFollowing = followingIds.includes(targetId);

            if (isFollowing) {
                await axios.post(
                    `${API_URL}/profiles/${targetId}/unfollow`,
                    {},
                    { headers }
                );

                setFollowingIds((prev) =>
                    prev.filter((id) => id !== targetId)
                );
            } else {
                await axios.post(
                    `${API_URL}/profiles/${targetId}/follow`,
                    {},
                    { headers }
                );

                setFollowingIds((prev) => [...prev, targetId]);
            }
        } catch (err) {
            console.error("Follow action error:", err);
            setError(
                err.response?.data?.message ||
                "Unable to update follow status."
            );
        }
    };

    const handleLogout = () => {
        if (logout) {
            logout();
            navigate("/login");
        }
    };

    return (
        <div className="explore-dashboard">

            {/* SIDEBAR */}
            <aside className="explore-sidebar">
                <Link to="/" className="explore-brand">
                    <span className="explore-brand-icon">
                        <Users size={22} />
                    </span>
                    <span>Connectly<span className="explore-brand-dot">.</span></span>
                </Link>

                <p className="explore-sidebar-label">MENU</p>

                <nav className="explore-navigation">
                    <NavLink to="/" end className={({ isActive }) =>
                        `explore-nav-link ${isActive ? "active" : ""}`
                    }>
                        <Home size={19} />
                        <span>Home</span>
                    </NavLink>

                    <NavLink to="/explore" className={({ isActive }) =>
                        `explore-nav-link ${isActive ? "active" : ""}`
                    }>
                        <Compass size={19} />
                        <span>Explore</span>
                    </NavLink>

                    <NavLink
                        to={userId ? `/profile/${userId}` : "/login"}
                        className={({ isActive }) =>
                            `explore-nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <UserRound size={19} />
                        <span>My Profile</span>
                    </NavLink>
                </nav>

                <div className="explore-sidebar-bottom">
                    <div className="explore-sidebar-promo">
                        <Sparkles size={22} />
                        <h4>Grow your network</h4>
                        <p>Connect with people and build meaningful relationships.</p>
                    </div>

                    <button className="explore-logout" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Log out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <main className="explore-main">

                {/* HEADER */}
                <header className="explore-header">
                    <div className="explore-header-title">
                        <span>DISCOVER</span>
                        <h2>Explore</h2>
                    </div>

                    <div className="explore-header-actions">
                        <button
                            className="explore-header-icon"
                            onClick={toggleTheme}
                            type="button"
                            title="Toggle theme"
                        >
                            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
                        </button>

                        <button
                            className="explore-header-icon"
                            type="button"
                            title="Notifications"
                        >
                            <Bell size={19} />
                        </button>

                        <Link
                            to={userId ? `/profile/${userId}` : "/login"}
                            className="explore-header-avatar"
                        >
                            {avatar ? (
                                <img src={avatar} alt={name} />
                            ) : initials}
                        </Link>
                    </div>
                </header>

                <div className="explore-content">

                    {/* HERO */}
                    <section className="explore-hero">
                        <div className="explore-hero-text">
                            <span className="explore-hero-tag">
                                <Sparkles size={14} /> DISCOVER YOUR COMMUNITY
                            </span>

                            <h1>Find your people.</h1>

                            <p>
                                Discover interesting profiles, meet new people,
                                and grow your Connectly community.
                            </p>
                        </div>

                        <div className="explore-hero-art">
                            <div className="explore-art-circle explore-art-circle-one"></div>
                            <div className="explore-art-circle explore-art-circle-two"></div>
                            <div className="explore-art-icon">
                                <Users size={42} />
                            </div>
                        </div>
                    </section>

                    {/* SEARCH */}
                    <section className="explore-search-section">
                        <div className="explore-section-title">
                            <div>
                                <h2>Discover people</h2>
                                <p>Search for users by their name or username.</p>
                            </div>
                        </div>

                        <form className="explore-search-form" onSubmit={handleSearch}>
                            <Search size={20} />

                            <input
                                type="text"
                                placeholder="Search people by name or username..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <button type="submit" disabled={loading}>
                                Search
                            </button>
                        </form>
                    </section>

                    {/* RESULTS */}
                    <section className="explore-results-section">
                        <div className="explore-results-heading">
                            <div>
                                <h2>
                                    {search.trim() ? "Search results" : "People you can discover"}
                                </h2>
                                <p>Connect with people on Connectly.</p>
                            </div>

                            <span className="explore-result-count">
                                {users.length} {users.length === 1 ? "person" : "people"}
                            </span>
                        </div>

                        {error && (
                            <div className="explore-error">{error}</div>
                        )}

                        {loading ? (
                            <div className="explore-state">
                                <div className="explore-spinner"></div>
                                <p>Finding people...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="explore-empty">
                                <div className="explore-empty-icon">
                                    <Users size={30} />
                                </div>
                                <h3>No people found</h3>
                                <p>
                                    {search.trim()
                                        ? "Try searching with another name or username."
                                        : "There are no other profiles to display right now."}
                                </p>
                            </div>
                        ) : (
                            <div className="explore-user-grid">
                                {users.map((person) => {
                                    const id = person._id || person.id;
                                    const personName =
                                        person.name ||
                                        person.fullName ||
                                        person.username ||
                                        "Connectly Member";

                                    const personAvatar =
                                        person.profilePicture ||
                                        person.profileImage ||
                                        person.avatar ||
                                        "";

                                    const personInitials = personName
                                        .split(" ")
                                        .map((part) => part[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase();

                                    const isFollowing = followingIds.includes(id);

                                    return (
                                        <article className="explore-user-card" key={id}>
                                            <div className="explore-card-top">
                                                <span className="explore-card-badge">
                                                    <Sparkles size={12} /> CONNECTLY MEMBER
                                                </span>
                                            </div>

                                            <Link
                                                to={`/profile/${id}`}
                                                className="explore-user-avatar"
                                            >
                                                {personAvatar ? (
                                                    <img src={personAvatar} alt={personName} />
                                                ) : personInitials}
                                            </Link>

                                            <h3>{personName}</h3>

                                            <p className="explore-username">
                                                @{person.username || "member"}
                                            </p>

                                            <p className="explore-user-bio">
                                                {person.bio || "Building connections on Connectly."}
                                            </p>

                                            <div className="explore-user-stats">
                                                <div>
                                                    <strong>
                                                        {person.followers?.length ??
                                                            person.followersCount ??
                                                            0}
                                                    </strong>
                                                    <span>Followers</span>
                                                </div>

                                                <div>
                                                    <strong>
                                                        {person.following?.length ??
                                                            person.followingCount ??
                                                            0}
                                                    </strong>
                                                    <span>Following</span>
                                                </div>
                                            </div>

                                            <div className="explore-card-actions">
                                                <button
                                                    type="button"
                                                    className={`explore-follow-button ${isFollowing ? "following" : ""
                                                        }`}
                                                    onClick={() => handleFollow(id)}
                                                >
                                                    {isFollowing ? (
                                                        <>
                                                            <UserCheck size={16} /> Following
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserPlus size={16} /> Follow
                                                        </>
                                                    )}
                                                </button>

                                                <Link
                                                    to={`/profile/${id}`}
                                                    className="explore-view-button"
                                                >
                                                    View profile
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <footer className="explore-footer">
                        <span>© 2026 Connectly</span>
                        <span>Discover. Connect. Grow.</span>
                    </footer>
                </div>
            </main>
        </div>
    );
}

export default Explore;
