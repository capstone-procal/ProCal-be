const mongoose = require("mongoose");
const Post = require("../models/Post");

const postController = {};

postController.createPost = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, category, content } = req.body;

    if (!title || !category || !content) {
      throw new Error("Title, category, and content are required");
    }

    const newPost = new Post({ userId, title, category, content });
    await newPost.save();

    res.status(201).json({ status: "success", post: newPost });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

postController.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isDeleted: false }).populate("userId", "name");
    res.status(200).json({ status: "success", posts });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

postController.getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("Invalid postId format");
    }

    const post = await Post.findById(postId).populate("userId", "name");
    if (!post || post.isDeleted) throw new Error("Post not found");

    res.status(200).json({ status: "success", post });
  } catch (err) {
    res.status(404).json({ status: "fail", error: err.message });
  }
};

postController.updatePost = async (req, res) => {
  try {
    const userId = req.userId;
    const userLevel = req.userLevel;
    const { postId } = req.params;
    const { title, category, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("Invalid postId format");
    }

    const post = await Post.findById(postId);
    if (!post || post.isDeleted) throw new Error("Post not found");

    const isOwner = String(post.userId) === userId;
    const isAdmin = userLevel === "admin";

    if (!isOwner && !isAdmin) throw new Error("No permission to update");

    post.title = title;
    post.category = category;
    post.content = content;

    await post.save();

    res.status(200).json({ status: "success", post });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

postController.deletePost = async (req, res) => {
  try {
    const userId = req.userId;
    const userLevel = req.userLevel; 
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("Invalid postId format");
    }

    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    const isOwner = String(post.userId) === userId;
    const isAdmin = userLevel === "admin";

    if (!isOwner && !isAdmin) throw new Error("No permission to delete");

    post.isDeleted = true;
    await post.save();

    res.status(200).json({ status: "success", message: "Post deleted" });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

module.exports = postController;