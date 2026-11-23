
import { useState } from "react";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

function PostCard({ post, onUpdate, onDelete }) {
    const { user, token } = useAuth();
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);

    const userId = user?.id || user?._id;
    const postUserId = post.user?._id || post.user;
    const isOwner = userId === postUserId;

    const isLiked = post.likes?.some(
        (like) => (like._id || like) === userId
    );

    const handleLike = async () => {
        try {
            await axios.put(
                `${API_URL}/likes/${post._id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onUpdate();
        } catch (error) {
            alert(error.response?.data?.message || "Unable to like post");
        }
    };

    const loadComments = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/comments/${post._id}`
            );
            setComments(response.data.comments || []);
            setShowComments(true);
        } catch (error) {
            alert("Unable to load comments");
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();

        if (!comment.trim()) return;

        try {
            await axios.post(
                `${API_URL}/comments/${post._id}`,
                { text: comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setComment("");
            loadComments();
        } catch (error) {
            alert(error.response?.data?.message || "Unable to add comment");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            await axios.delete(
                `${API_URL}/posts/${post._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onDelete(post._id);
        } catch (error) {
            alert(error.response?.data?.message || "Unable to delete post");
        }
    };

    return (
        <article className="post-card">
            <div className="post-header">
                <div className="post-avatar">
                    {(post.user?.name || "U").charAt(0).toUpperCase()}
                </div>

                <div className="post-user-info">
                    <strong>{post.user?.name || "User"}</strong>
                    <span>@{post.user?.username || "user"}</span>
                </div>

                {isOwner && (
                    <button className="delete-btn" onClick={handleDelete}>
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            <p className="post-content">{post.content}</p>

            {post.image && (
                <img
                    src={post.image}
                    alt="Post"
                    className="post-image"
                />
            )}

            <div className="post-actions">
                <button
                    className={isLiked ? "action-btn liked" : "action-btn"}
                    onClick={handleLike}
                >
                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                    {post.likes?.length || 0}
                </button>

                <button className="action-btn" onClick={loadComments}>
                    <MessageCircle size={20} />
                    Comments
                </button>
            </div>

            {showComments && (
                <div className="comments-section">
                    {comments.map((item) => (
                        <div className="comment-item" key={item._id}>
                            <strong>{item.user?.username || "User"}</strong>
                            <span>{item.text}</span>
                        </div>
                    ))}

                    <form onSubmit={handleComment} className="comment-form">
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </article>
    );
}

export default PostCard;
