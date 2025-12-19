import Comment from "../models/Comment.js";
import mongoose from "mongoose";

/* GET COMMENTS BY BLOG */
export const getComments = async (req, res) => {
  const { blogId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ message: "Invalid blog id" });
  }

  try {
    const comments = await Comment.find({ blog: blogId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

/* ADD COMMENT */
export const addComment = async (req, res) => {
  const { blogId } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ message: "Invalid blog id" });
  }

  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const comment = await Comment.create({
      blog: blogId,
      user: req.user.id,
      text,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};
