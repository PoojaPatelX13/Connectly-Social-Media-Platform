const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    toggleFollow,
    getFollowers,
    getFollowing
} = require("../controllers/followController");

// Follow or Unfollow a User
router.put("/:userId", protect, toggleFollow);

// Get Followers
router.get("/:userId/followers", getFollowers);

// Get Following
router.get("/:userId/following", getFollowing);

module.exports = router;