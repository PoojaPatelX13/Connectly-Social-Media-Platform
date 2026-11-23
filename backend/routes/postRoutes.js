const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createPost,
    getAllPosts,
    deletePost
} = require("../controllers/postController");

// Get all posts
router.get("/", getAllPosts);

// Create a new post
router.post("/", protect, createPost);

// Delete a post
router.delete("/:id", protect, deletePost);

module.exports = router;