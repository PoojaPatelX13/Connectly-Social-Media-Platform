const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { toggleLike } = require("../controllers/likeController");

// Like or Unlike a Post
router.put("/:postId", protect, toggleLike);

module.exports = router;