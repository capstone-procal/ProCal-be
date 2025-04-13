const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authController = require("../controllers/auth.controller");

router.post("/", authController.authenticate, postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/detail/:postId", postController.getPostById);
router.put("/:postId", authController.authenticate, postController.updatePost);
router.delete(
  "/:postId",
  authController.authenticate,
  postController.deletePost
);

module.exports = router;
