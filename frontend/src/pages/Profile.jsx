
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Link,
    NavLink,
    useNavigate,
    useParams
} from "react-router-dom";
import axios from "axios";
import {
    Home,
    Compass,
    UserRound,
    Sun,
    Moon,
    LogOut,
    Edit3,
    Users,
    FileText,
    Heart,
    MessageCircle,
    Camera,
    X,
    Check,
    LoaderCircle,
    UserPlus,
    UserCheck,
    MapPin,
    Globe,
    CalendarDays,
    Send,
    Sparkles
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Profile({ theme, toggleTheme }) {
    const { user: authUser, token: authToken, logout } = useAuth();
    const { userId } = useParams();
    const navigate = useNavigate();

    const storedUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
            return {};
        }
    }, []);

    const currentUser = authUser || storedUser;

    const currentUserId =
        currentUser?._id ||
        currentUser?.id ||
        currentUser?.userId ||
        storedUser?._id ||
        storedUser?.id;

    const token =
        authToken ||
        localStorage.getItem("token") ||
        "";

    const profileId = userId || currentUserId;

    const isOwnProfile =
        String(profileId) === String(currentUserId);

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        bio: "",
        location: "",
        website: ""
    });

    const headers = useMemo(() => ({
        Authorization: `Bearer ${token}`
    }), [token]);

    const getProfileData = (response) => {
        const data = response?.data;

        return (
            data?.profile ||
            data?.user ||
            data?.data?.profile ||
            data?.data?.user ||
            data?.data ||
            data ||
            null
        );
    };

    const getPostsData = (response) => {
        const data = response?.data;

        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.posts)) return data.posts;
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data?.data?.posts)) return data.data.posts;

        return [];
    };

    const loadProfile = useCallback(async () => {
        if (!profileId) {
            setError("Profile information is not available.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const [profileResponse, postsResponse] = await Promise.all([
                axios.get(`${API_URL}/profiles/${profileId}`, { headers }),
                axios.get(`${API_URL}/posts`, { headers })
            ]);

            const profileData = getProfileData(profileResponse);
            const allPosts = getPostsData(postsResponse);

            if (!profileData) {
                throw new Error("Profile could not be loaded.");
            }

            setProfile(profileData);

            const profileUserId =
                profileData?._id ||
                profileData?.id ||
                profileId;

            const ownPosts = allPosts.filter((post) => {
                const author =
                    post.author ||
                    post.user ||
                    post.userId;

                const authorId =
                    typeof author === "object"
                        ? author?._id || author?.id
                        : author;

                return String(authorId) === String(profileUserId);
            });

            setPosts(ownPosts);

            const followers = profileData.followers || [];

            setIsFollowing(
                followers.some((follower) => {
                    const followerId =
                        typeof follower === "object"
                            ? follower?._id || follower?.id
                            : follower;

                    return String(followerId) === String(currentUserId);
                })
            );

            setFormData({
                fullName:
                    profileData.fullName ||
                    profileData.name ||
                    "",
                username: profileData.username || "",
                bio: profileData.bio || "",
                location: profileData.location || "",
                website: profileData.website || ""
            });
        } catch (err) {
            console.error("Profile loading error:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load profile."
            );
        } finally {
            setLoading(false);
        }
    }, [profileId, headers, currentUserId]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSaveProfile = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);

            const response = await axios.put(
                `${API_URL}/profiles/${currentUserId}`,
                formData,
                { headers }
            );

            const updatedProfile = getProfileData(response);

            if (updatedProfile) {
                setProfile((previous) => ({
                    ...previous,
                    ...updatedProfile
                }));
            } else {
                setProfile((previous) => ({
                    ...previous,
                    ...formData
                }));
            }

            setIsEditing(false);
            await loadProfile();
        } catch (err) {
            console.error("Profile update error:", err);
            alert(
                err.response?.data?.message ||
                "Unable to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleFollow = async () => {
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setFollowLoading(true);

            const action = isFollowing ? "unfollow" : "follow";

            await axios.post(
                `${API_URL}/profiles/${profileId}/${action}`,
                {},
                { headers }
            );

            setIsFollowing(!isFollowing);

            setProfile((previous) => {
                if (!previous) return previous;

                const followers = previous.followers || [];

                return {
                    ...previous,
                    followers: isFollowing
                        ? followers.filter((follower) => {
                            const id =
                                typeof follower === "object"
                                    ? follower?._id || follower?.id
                                    : follower;

                            return String(id) !== String(currentUserId);
                        })
                        : [...followers, currentUserId]
                };
            });
        } catch (err) {
            console.error("Follow error:", err);
            alert(
                err.response?.data?.message ||
                "Unable to update follow status."
            );
        } finally {
            setFollowLoading(false);
        }
    };

    const handleLogout = () => {
        if (logout) {
            logout();
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }

        navigate("/login");
    };

    const displayName =
        profile?.fullName ||
        profile?.name ||
        profile?.username ||
        "Connectly Member";

    const username = profile?.username || "connectlyuser";

    const bio =
        profile?.bio ||
        "Welcome to my Connectly profile. I'm here to connect, share and grow with the community.";

    const avatarLetter = displayName.charAt(0).toUpperCase();

    const followersCount = Array.isArray(profile?.followers)
        ? profile.followers.length
        : Number(profile?.followersCount || 0);

    const followingCount = Array.isArray(profile?.following)
        ? profile.following.length
        : Number(profile?.followingCount || 0);

    const formatDate = (dateValue) => {
        if (!dateValue) return "Connectly member";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) return "Connectly member";

        return date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });
    };

    const getAuthorName = (post) => {
        const author = post.author || post.user || {};

        if (typeof author === "string") return displayName;

        return (
            author.fullName ||
            author.name ||
            author.username ||
            displayName
        );
    };

    const getPostContent = (post) => {
        return post.content || post.text || post.caption || "";
    };

    const getPostDate = (post) => {
        const date = post.createdAt || post.updatedAt;

        if (!date) return "";

        return new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="profile-loading-screen">
                <LoaderCircle className="profile-loader-icon" size={38} />
                <h3>Loading your profile</h3>
                <p>Getting everything ready for you...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="profile-error-screen">
                <div className="profile-error-icon">
                    <UserRound size={35} />
                </div>
                <h2>Profile unavailable</h2>
                <p>{error || "We couldn't find this profile."}</p>
                <button onClick={() => navigate("/")}>
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="profile-dashboard">
            <aside className="profile-sidebar">
                <Link to="/" className="profile-brand">
                    <div className="profile-brand-icon">
                        <Users size={25} />
                    </div>
                    <span>Connectly</span>
                </Link>

                <div className="profile-sidebar-section">
                    <p className="profile-sidebar-heading">MENU</p>

                    <nav className="profile-navigation">
                        <NavLink to="/" end>
                            <Home size={20} />
                            <span>Home</span>
                        </NavLink>

                        <NavLink to="/explore">
                            <Compass size={20} />
                            <span>Explore</span>
                        </NavLink>

                        <NavLink
                            to={`/profile/${currentUserId}`}
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            <UserRound size={20} />
                            <span>My Profile</span>
                        </NavLink>
                    </nav>
                </div>

                <div className="profile-sidebar-bottom">
                    <button
                        className="profile-sidebar-action"
                        onClick={toggleTheme}
                    >
                        {theme === "dark" ? (
                            <Sun size={20} />
                        ) : (
                            <Moon size={20} />
                        )}
                        <span>
                            {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </span>
                    </button>

                    <button
                        className="profile-sidebar-action"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>

                    <div className="profile-sidebar-user">
                        <div className="profile-sidebar-avatar">
                            {avatarLetter}
                        </div>

                        <div className="profile-sidebar-user-details">
                            <strong>{displayName}</strong>
                            <span>Connectly Member</span>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="profile-dashboard-content">
                <header className="profile-topbar">
                    <div>
                        <span className="profile-eyebrow">
                            YOUR CONNECTLY SPACE
                        </span>
                        <h1>My Profile</h1>
                        <p>Manage your identity and community presence.</p>
                    </div>

                    <div className="profile-topbar-actions">
                        <button
                            className="profile-theme-button"
                            onClick={toggleTheme}
                            title="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <Sun size={20} />
                            ) : (
                                <Moon size={20} />
                            )}
                        </button>

                        <div className="profile-topbar-avatar">
                            {avatarLetter}
                        </div>
                    </div>
                </header>

                <section className="profile-welcome-banner">
                    <div className="profile-welcome-content">
                        <span className="profile-banner-label">
                            <Sparkles size={14} /> CONNECT · SHARE · GROW
                        </span>
                        <h2>Your space, your story.</h2>
                        <p>
                            Every connection starts with being yourself.
                            Make your profile yours.
                        </p>
                    </div>

                    <div className="profile-welcome-art">
                        <Users size={42} />
                    </div>
                    <div className="profile-welcome-decoration" />
                </section>

                <section className="profile-main-card">
                    <div className="profile-cover">
                        <div className="profile-cover-pattern" />
                        <div className="profile-cover-orbit profile-orbit-one" />
                        <div className="profile-cover-orbit profile-orbit-two" />

                        <div className="profile-cover-label">
                            <Camera size={15} />
                            CONNECTLY MEMBER
                        </div>
                    </div>

                    <div className="profile-card-body">
                        <div className="profile-identity-row">
                            <div className="profile-avatar">
                                {profile.profileImage ? (
                                    <img
                                        src={profile.profileImage}
                                        alt={displayName}
                                    />
                                ) : (
                                    avatarLetter
                                )}
                            </div>

                            <div className="profile-identity-info">
                                <h2>{displayName}</h2>
                                <p>@{username}</p>

                                <span className="profile-member-tag">
                                    <UserRound size={13} />
                                    Community Member
                                </span>
                            </div>

                            <div className="profile-header-actions">
                                {isOwnProfile ? (
                                    <button
                                        className="profile-edit-button"
                                        onClick={() => setIsEditing(!isEditing)}
                                    >
                                        {isEditing ? (
                                            <>
                                                <X size={17} /> Close
                                            </>
                                        ) : (
                                            <>
                                                <Edit3 size={17} /> Edit Profile
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        className={`profile-follow-button ${isFollowing ? "following" : ""}`}
                                        onClick={handleFollow}
                                        disabled={followLoading}
                                    >
                                        {followLoading ? (
                                            <LoaderCircle size={17} className="profile-spin" />
                                        ) : isFollowing ? (
                                            <UserCheck size={17} />
                                        ) : (
                                            <UserPlus size={17} />
                                        )}
                                        {isFollowing ? "Following" : "Follow"}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="profile-information-grid">
                            <div className="profile-about-panel">
                                <div className="profile-section-title">
                                    <span className="profile-section-icon">
                                        <UserRound size={17} />
                                    </span>
                                    <div>
                                        <h3>About Me</h3>
                                        <p>A little introduction</p>
                                    </div>
                                </div>

                                <p className="profile-bio-text">{bio}</p>

                                <div className="profile-extra-details">
                                    {profile.location && (
                                        <span>
                                            <MapPin size={15} />
                                            {profile.location}
                                        </span>
                                    )}

                                    {profile.website && (
                                        <a
                                            href={
                                                profile.website.startsWith("http")
                                                    ? profile.website
                                                    : `https://${profile.website}`
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <Globe size={15} />
                                            Website
                                        </a>
                                    )}

                                    <span>
                                        <CalendarDays size={15} />
                                        Joined {formatDate(profile.createdAt)}
                                    </span>
                                </div>
                            </div>

                            <div className="profile-stats-panel">
                                <div className="profile-section-title">
                                    <span className="profile-section-icon">
                                        <Sparkles size={17} />
                                    </span>
                                    <div>
                                        <h3>Your Activity</h3>
                                        <p>Your community overview</p>
                                    </div>
                                </div>

                                <div className="profile-stats-grid">
                                    <div className="profile-stat-card">
                                        <div className="profile-stat-icon posts-icon">
                                            <FileText size={19} />
                                        </div>
                                        <strong>{posts.length}</strong>
                                        <span>Posts</span>
                                    </div>

                                    <div className="profile-stat-card">
                                        <div className="profile-stat-icon followers-icon">
                                            <Users size={19} />
                                        </div>
                                        <strong>{followersCount}</strong>
                                        <span>Followers</span>
                                    </div>

                                    <div className="profile-stat-card">
                                        <div className="profile-stat-icon following-icon">
                                            <UserRound size={19} />
                                        </div>
                                        <strong>{followingCount}</strong>
                                        <span>Following</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {isEditing && isOwnProfile && (
                    <section className="profile-edit-section">
                        <div className="profile-edit-heading">
                            <div>
                                <span className="profile-eyebrow">PERSONAL DETAILS</span>
                                <h2>Edit your profile</h2>
                                <p>Keep your profile information up to date.</p>
                            </div>
                            <div className="profile-edit-heading-icon">
                                <Edit3 size={22} />
                            </div>
                        </div>

                        <form onSubmit={handleSaveProfile}>
                            <div className="profile-form-grid">
                                <div className="profile-form-group">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="Enter username"
                                    />
                                </div>

                                <div className="profile-form-group profile-form-full">
                                    <label htmlFor="bio">About / Bio</label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        rows="4"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        placeholder="Write something about yourself..."
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label htmlFor="location">Location</label>
                                    <input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="Your city"
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label htmlFor="website">Website</label>
                                    <input
                                        id="website"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        placeholder="Your website URL"
                                    />
                                </div>
                            </div>

                            <div className="profile-form-actions">
                                <button
                                    type="button"
                                    className="profile-cancel-button"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="profile-save-button"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <LoaderCircle size={17} className="profile-spin" />
                                    ) : (
                                        <Check size={17} />
                                    )}
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                <section className="profile-posts-section">
                    <div className="profile-posts-heading">
                        <div>
                            <span className="profile-eyebrow">YOUR ACTIVITY</span>
                            <h2>
                                {isOwnProfile ? "Your Posts" : `${displayName}'s Posts`}
                            </h2>
                            <p>
                                Conversations and moments shared with the community.
                            </p>
                        </div>

                        <div className="profile-post-count">
                            <FileText size={17} />
                            {posts.length} {posts.length === 1 ? "Post" : "Posts"}
                        </div>
                    </div>

                    {posts.length === 0 ? (
                        <div className="profile-empty-posts">
                            <div className="profile-empty-icon">
                                <Send size={28} />
                            </div>
                            <h3>No posts yet</h3>
                            <p>
                                {isOwnProfile
                                    ? "Your posts will appear here when you share something with the community."
                                    : "This member hasn't shared any posts yet."}
                            </p>

                            {isOwnProfile && (
                                <Link to="/" className="profile-create-post-link">
                                    Go to Home
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="profile-post-list">
                            {posts.map((post) => (
                                <article
                                    className="profile-post-card"
                                    key={post._id || post.id}
                                >
                                    <div className="profile-post-header">
                                        <div className="profile-post-avatar">
                                            {avatarLetter}
                                        </div>

                                        <div className="profile-post-author">
                                            <strong>{getAuthorName(post)}</strong>
                                            <span>{getPostDate(post)}</span>
                                        </div>

                                        <span className="profile-post-badge">
                                            <Sparkles size={13} /> Community
                                        </span>
                                    </div>

                                    <p className="profile-post-content">
                                        {getPostContent(post)}
                                    </p>

                                    {post.image && (
                                        <img
                                            className="profile-post-image"
                                            src={post.image}
                                            alt="Post attachment"
                                        />
                                    )}

                                    <div className="profile-post-footer">
                                        <span>
                                            <Heart size={17} />
                                            {Array.isArray(post.likes)
                                                ? post.likes.length
                                                : post.likesCount || 0} Likes
                                        </span>

                                        <span>
                                            <MessageCircle size={17} />
                                            {Array.isArray(post.comments)
                                                ? post.comments.length
                                                : post.commentsCount || 0} Comments
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <footer className="profile-footer">
                    <span>© 2026 Connectly</span>
                    <span>Made for meaningful connections.</span>
                </footer>
            </main>
        </div>
    );
}

export default Profile;
