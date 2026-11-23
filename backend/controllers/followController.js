const Follow = require("../models/Follow");
const User = require("../models/User");

// Follow or Unfollow a User
const toggleFollow = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        if (userId === currentUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself"
            });
        }

        const targetUser = await User.findById(userId);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const existingFollow = await Follow.findOne({
            follower: currentUserId,
            following: userId
        });

        if (existingFollow) {
            await Follow.findByIdAndDelete(existingFollow._id);

            return res.status(200).json({
                success: true,
                message: "User unfollowed successfully",
                following: false
            });
        }

        await Follow.create({
            follower: currentUserId,
            following: userId
        });

        res.status(201).json({
            success: true,
            message: "User followed successfully",
            following: true
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Followers
const getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;

        const followers = await Follow.find({ following: userId })
            .populate("follower", "name username profilePicture");

        res.status(200).json({
            success: true,
            count: followers.length,
            followers: followers.map(item => item.follower)
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Following
const getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;

        const following = await Follow.find({ follower: userId })
            .populate("following", "name username profilePicture");

        res.status(200).json({
            success: true,
            count: following.length,
            following: following.map(item => item.following)
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    toggleFollow,
    getFollowers,
    getFollowing
};