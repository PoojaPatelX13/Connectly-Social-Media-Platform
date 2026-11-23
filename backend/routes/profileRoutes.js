const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getProfile,
    updateProfile,
    searchUsers
} = require("../controllers/profileController");

// Search Users
router.get("/search", searchUsers);

// Get User Profile
router.get("/:userId", getProfile);

// Update Own Profile
router.put("/", protect, updateProfile);

module.exports = router;