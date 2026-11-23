const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addComment,
    getComments,
    deleteComment
} = require("../controllers/commentController");

// Get comments for a post
router.get("/:postId", getComments);

// Add a comment
router.post("/:postId", protect, addComment);

// Delete a comment
router.delete("/:id", protect, deleteComment);

module.exports = router;