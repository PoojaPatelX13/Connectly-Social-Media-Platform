const User = require("../models/User");
const Post = require("../models/Post");
const Follow = require("../models/Follow");

// Get User Profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const posts = await Post.find({ user: user._id })
            .populate("user", "name username profilePicture")
            .sort({ createdAt: -1 });

        const followersCount = await Follow.countDocuments({
            following: user._id
        });

        const followingCount = await Follow.countDocuments({
            follower: user._id
        });

        res.status(200).json({
            success: true,
            user,
            posts,
            postsCount: posts.length,
            followersCount,
            followingCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Own Profile
const updateProfile = async (req, res) => {
    try {
        const { name, bio, profilePicture } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                name,
                bio,
                profilePicture
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Search Users
const searchUsers = async (req, res) => {
    try {
        const query = req.query.q;

        if (!query || !query.trim()) {
            return res.status(200).json({
                success: true,
                count: 0,
                users: []
            });
        }

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { username: { $regex: query, $options: "i" } }
            ]
        }).select("-password").limit(20);

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    searchUsers
};