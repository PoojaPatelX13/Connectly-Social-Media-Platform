
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Home as HomeIcon,
    Compass,
    UserRound,
    Users,
    Heart,
    MessageCircle,
    ImagePlus,
    Send,
    Sun,
    Moon,
    Bell,
    Search,
    LogOut,
    MoreHorizontal,
    TrendingUp,
    Sparkles,
    Plus,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./Home.css";

const API_URL = "http://localhost:5000/api";

function Home({ theme, toggleTheme }) {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [profile, setProfile] = useState(null);
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState("");

    const userId = user?._id || user?.id;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const name =
        user?.name ||
        user?.fullName ||
        user?.username ||
        "Connectly User";

    const username = user?.username || "connectlyuser";

    const avatar =
        user?.profilePicture ||
        user?.profileImage ||
        user?.avatar ||
        "";

    const initials = name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    useEffect(() => {
        fetchDashboard();
    }, [userId, token]);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(`${API_URL}/posts`, { headers });

            const data =
                response.data?.posts ||
                response.data?.data ||
                response.data;

            setPosts(Array.isArray(data) ? data : []);

            if (userId) {
                try {
                    const profileResponse = await axios.get(
                        `${API_URL}/profiles/${userId}`,
                        { headers }
                    );

                    setProfile(
                        profileResponse.data?.profile ||
                        profileResponse.data?.data ||
                        profileResponse.data
                    );
                } catch (profileError) {
                    console.error("Profile fetch error:", profileError);
                }
            }
        } catch (err) {
            console.error("Posts fetch error:", err);
            setError("Unable to load posts. Please refresh the page.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (event) => {
        event.preventDefault();

        if (!content.trim()) {
            setError("Please write something before publishing.");
            return;
        }

        try {
            setPosting(true);
            setError("");

            await axios.post(
                `${API_URL}/posts`,
                {
                    content: content.trim(),
                    image: image.trim(),
                },
                { headers }
            );

            setContent("");
            setImage("");
            await fetchDashboard();
        } catch (err) {
            console.error("Create post error:", err);
            setError(
                err.response?.data?.message ||
                "Unable to publish your post. Please try again."
            );
        } finally {
            setPosting(false);
        }
    };

    const handleLogout = () => {
        if (logout) {
            logout();
            navigate("/login");
        }
    };

    const getAuthor = (post) =>
        post?.user?.name ||
        post?.user?.fullName ||
        post?.user?.username ||
        post?.author?.name ||
        post?.author?.username ||
        "Connectly Member";

    const getUsername = (post) =>
        post?.user?.username ||
        post?.author?.username ||
        "member";

    const getAvatar = (post) =>
        post?.user?.profilePicture ||
        post?.user?.avatar ||
        post?.author?.profilePicture ||
        "";

    const getContent = (post) => post?.content || post?.text || "";

    const getImage = (post) => post?.image || post?.imageUrl || "";

    const getDate = (post) => {
        const date = post?.createdAt || post?.updatedAt;

        if (!date) return "Recently";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
        });
    };

    const followers =
        profile?.followers?.length ??
        profile?.followersCount ??
        0;

    const following =
        profile?.following?.length ??
        profile?.followingCount ??
        0;

    const myPosts = posts.filter((post) => {
        const authorId =
            post?.user?._id ||
            post?.user?.id ||
            post?.userId ||
            post?.author?._id;

        return authorId && String(authorId) === String(userId);
    }).length;

    return (
        <div className="home-dashboard">

            {/* SIDEBAR */}
            <aside className="home-sidebar">
                <Link to="/" className="home-brand">
                    <span className="home-brand-icon">
                        <Users size={22} />
                    </span>
                    <span>
                        Connectly<span className="home-brand-dot">.</span>
                    </span>
                </Link>

                <p className="home-sidebar-label">MENU</p>

                <nav className="home-navigation">
                    <NavLink to="/" end className={({ isActive }) =>
                        `home-nav-link ${isActive ? "active" : ""}`
                    }>
                        <HomeIcon size={19} />
                        <span>Home</span>
                    </NavLink>

                    <NavLink to="/explore" className={({ isActive }) =>
                        `home-nav-link ${isActive ? "active" : ""}`
                    }>
                        <Compass size={19} />
                        <span>Explore</span>
                    </NavLink>

                    <NavLink
                        to={userId ? `/profile/${userId}` : "/login"}
                        className={({ isActive }) =>
                            `home-nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <UserRound size={19} />
                        <span>My Profile</span>
                    </NavLink>
                </nav>

                <div className="home-sidebar-bottom">
                    <div className="home-sidebar-promo">
                        <span className="home-promo-icon">
                            <Sparkles size={19} />
                        </span>
                        <h4>Stay connected</h4>
                        <p>Share your moments and discover new people.</p>
                        <Link to="/explore">Explore now <span>→</span></Link>
                    </div>

                    <button className="home-logout-button" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Log out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN AREA */}
            <main className="home-main">

                {/* HEADER */}
                <header className="home-header">
                    <div className="home-header-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search people and posts..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter") navigate("/explore");
                            }}
                        />
                    </div>

                    <div className="home-header-actions">
                        <button
                            className="home-header-icon"
                            onClick={toggleTheme}
                            title="Toggle theme"
                            type="button"
                        >
                            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
                        </button>

                        <button
                            className="home-header-icon"
                            type="button"
                            title="Notifications"
                        >
                            <Bell size={19} />
                            <span className="home-notification-dot"></span>
                        </button>

                        <Link
                            to={userId ? `/profile/${userId}` : "/login"}
                            className="home-header-user"
                        >
                            {avatar ? (
                                <img src={avatar} alt={name} />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </Link>
                    </div>
                </header>

                <div className="home-content">

                    {/* WELCOME */}
                    <section className="home-welcome">
                        <div className="home-welcome-text">
                            <span className="home-welcome-tag">
                                <Sparkles size={14} /> YOUR SOCIAL SPACE
                            </span>
                            <h1>Good to see you, {name.split(" ")[0]}!</h1>
                            <p>
                                Catch up with your community and share what's happening today.
                            </p>
                            <Link to="/explore" className="home-welcome-button">
                                Discover people <span>→</span>
                            </Link>
                        </div>

                        <div className="home-welcome-art">
                            <div className="home-art-circle home-art-circle-one"></div>
                            <div className="home-art-circle home-art-circle-two"></div>
                            <div className="home-art-card">
                                <Users size={38} />
                                <span>Connect. Share. Grow.</span>
                            </div>
                        </div>
                    </section>

                    {/* PAGE HEADING */}
                    <div className="home-section-heading">
                        <div>
                            <h2>Your overview</h2>
                            <p>Here's what's happening in your space.</p>
                        </div>
                        <span className="home-today-label">YOUR DASHBOARD</span>
                    </div>

                    {/* STATS */}
                    <section className="home-stats-grid">
                        <div className="home-stat-card">
                            <div className="home-stat-top">
                                <span className="home-stat-icon teal">
                                    <Users size={20} />
                                </span>
                                <span className="home-stat-caption">Community</span>
                            </div>
                            <h3>{followers}</h3>
                            <p>Followers</p>
                        </div>

                        <div className="home-stat-card">
                            <div className="home-stat-top">
                                <span className="home-stat-icon blue">
                                    <UserRound size={20} />
                                </span>
                                <span className="home-stat-caption">Connections</span>
                            </div>
                            <h3>{following}</h3>
                            <p>Following</p>
                        </div>

                        <div className="home-stat-card">
                            <div className="home-stat-top">
                                <span className="home-stat-icon purple">
                                    <MessageCircle size={20} />
                                </span>
                                <span className="home-stat-caption">Your activity</span>
                            </div>
                            <h3>{myPosts}</h3>
                            <p>Your posts</p>
                        </div>

                        <div className="home-stat-card">
                            <div className="home-stat-top">
                                <span className="home-stat-icon orange">
                                    <TrendingUp size={20} />
                                </span>
                                <span className="home-stat-caption">On Connectly</span>
                            </div>
                            <h3>{posts.length}</h3>
                            <p>Community posts</p>
                        </div>
                    </section>

                    {/* FEED AND RIGHT PANEL */}
                    <div className="home-feed-layout">

                        <section className="home-feed-column">

                            {/* CREATE POST */}
                            <div className="home-create-card">
                                <div className="home-card-heading">
                                    <div>
                                        <h3>Create a post</h3>
                                        <p>Share something with your community.</p>
                                    </div>
                                    <span className="home-create-sparkle">
                                        <Sparkles size={18} />
                                    </span>
                                </div>

                                <form onSubmit={handleCreatePost}>
                                    <div className="home-create-input-row">
                                        <div className="home-user-avatar">
                                            {avatar ? (
                                                <img src={avatar} alt={name} />
                                            ) : initials}
                                        </div>

                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder={`What's on your mind, ${name.split(" ")[0]}?`}
                                            rows="3"
                                        />
                                    </div>

                                    <input
                                        className="home-image-input"
                                        type="url"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        placeholder="Paste an image URL (optional)"
                                    />

                                    {error && (
                                        <p className="home-error-message">{error}</p>
                                    )}

                                    <div className="home-create-footer">
                                        <span className="home-image-hint">
                                            <ImagePlus size={17} />
                                            Add an image using its URL
                                        </span>

                                        <button
                                            className="home-publish-button"
                                            type="submit"
                                            disabled={posting}
                                        >
                                            {posting ? "Publishing..." : "Publish"}
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* FEED HEADING */}
                            <div className="home-feed-heading">
                                <div>
                                    <h2>Community feed</h2>
                                    <p>See what people are sharing.</p>
                                </div>
                                <span className="home-feed-count">{posts.length} posts</span>
                            </div>

                            {/* POSTS */}
                            {loading ? (
                                <div className="home-state-card">
                                    <div className="home-loading-spinner"></div>
                                    <p>Loading your feed...</p>
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="home-state-card home-empty-state">
                                    <div className="home-empty-icon">
                                        <MessageCircle size={28} />
                                    </div>
                                    <h3>Your feed is waiting</h3>
                                    <p>Be the first to share something with the community.</p>
                                </div>
                            ) : (
                                <div className="home-post-list">
                                    {posts.map((post) => {
                                        const author = getAuthor(post);
                                        const postAvatar = getAvatar(post);
                                        const postInitials = author
                                            .split(" ")
                                            .map((part) => part[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase();

                                        return (
                                            <article
                                                className="home-post-card"
                                                key={post._id || post.id}
                                            >
                                                <div className="home-post-header">
                                                    <div className="home-post-user">
                                                        <div className="home-post-avatar">
                                                            {postAvatar ? (
                                                                <img src={postAvatar} alt={author} />
                                                            ) : postInitials}
                                                        </div>

                                                        <div>
                                                            <h4>{author}</h4>
                                                            <span>
                                                                @{getUsername(post)} · {getDate(post)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        className="home-post-more"
                                                        type="button"
                                                        aria-label="More post options"
                                                    >
                                                        <MoreHorizontal size={21} />
                                                    </button>
                                                </div>

                                                <p className="home-post-content">
                                                    {getContent(post)}
                                                </p>

                                                {getImage(post) && (
                                                    <div className="home-post-image">
                                                        <img
                                                            src={getImage(post)}
                                                            alt="Post attachment"
                                                        />
                                                    </div>
                                                )}

                                                <div className="home-post-actions">
                                                    <span>
                                                        <Heart size={17} />
                                                        {post.likes?.length ?? post.likesCount ?? 0} Likes
                                                    </span>
                                                    <span>
                                                        <MessageCircle size={17} />
                                                        {post.comments?.length ?? post.commentsCount ?? 0} Comments
                                                    </span>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* RIGHT PANEL */}
                        <aside className="home-right-column">

                            <div className="home-profile-widget">
                                <div className="home-widget-heading">
                                    <h3>Your profile</h3>
                                    <Link to={userId ? `/profile/${userId}` : "/login"}>
                                        View
                                    </Link>
                                </div>

                                <div className="home-profile-widget-user">
                                    <div className="home-profile-widget-avatar">
                                        {avatar ? (
                                            <img src={avatar} alt={name} />
                                        ) : initials}
                                    </div>
                                    <h4>{name}</h4>
                                    <p>@{username}</p>
                                </div>

                                <div className="home-profile-widget-stats">
                                    <div>
                                        <strong>{followers}</strong>
                                        <span>Followers</span>
                                    </div>
                                    <div>
                                        <strong>{following}</strong>
                                        <span>Following</span>
                                    </div>
                                    <div>
                                        <strong>{myPosts}</strong>
                                        <span>Posts</span>
                                    </div>
                                </div>

                                <Link
                                    to={userId ? `/profile/${userId}` : "/login"}
                                    className="home-profile-link"
                                >
                                    View your profile
                                </Link>
                            </div>

                            <div className="home-discover-widget">
                                <div className="home-widget-heading">
                                    <h3>Discover</h3>
                                    <Sparkles size={17} />
                                </div>

                                <div className="home-discover-content">
                                    <div className="home-discover-icon">
                                        <Compass size={22} />
                                    </div>
                                    <h4>Find your community</h4>
                                    <p>
                                        Explore new profiles and connect with people who share
                                        your interests.
                                    </p>
                                    <Link to="/explore">
                                        Explore Connectly <span>→</span>
                                    </Link>
                                </div>
                            </div>

                            <div className="home-community-note">
                                <div className="home-community-note-icon">
                                    <Heart size={18} />
                                </div>
                                <div>
                                    <h4>Spread positivity</h4>
                                    <p>A little kindness makes every connection better.</p>
                                </div>
                            </div>

                        </aside>
                    </div>

                    <footer className="home-footer">
                        <span>© 2026 Connectly</span>
                        <span>Connect. Share. Grow.</span>
                    </footer>
                </div>
            </main>
        </div>
    );
}

export default Home;
