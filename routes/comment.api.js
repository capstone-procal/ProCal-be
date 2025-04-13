const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const authController = require("../controllers/auth.controller");

router.post("/", authController.authenticate, commentController.createComment);
router.get("/:postId", commentController.getCommentsByPost);
router.get("/detail/:commentId", commentController.getCommentById);
router.put("/:commentId", authController.authenticate, commentController.updateComment);
router.delete("/:commentId", authController.authenticate, commentController.deleteComment);

module.exports = router;
