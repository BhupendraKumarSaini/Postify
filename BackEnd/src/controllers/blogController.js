import Blog from "../models/Blog.js";
import mongoose from "mongoose";
import Notification from "../models/Notification.js";

/* CREATE BLOG */
export const createBlog = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const blog = await Blog.create({
      title,
      content,
      category,
      tags: tags?.split(",") || [],
      cover: req.file ? `/uploads/blogs/${req.file.filename}` : null,
      author: req.user.id,
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ message: "Failed to create blog" });
  }
};

/* GET ALL BLOGS */
export const getBlogs = async (_req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

/* TRENDING BLOGS (MOST LIKED) */
export const getTrendingBlogs = async (_req, res) => {
  try {
    const blogs = await Blog.aggregate([
      { $addFields: { likesCount: { $size: "$likes" } } },
      { $sort: { likesCount: -1 } },
      { $limit: 6 },
    ]);

    await Blog.populate(blogs, {
      path: "author",
      select: "name avatar",
    });

    res.json(blogs);
  } catch (error) {
    console.error("Trending blogs error:", error);
    res.status(500).json({ message: "Failed to fetch trending blogs" });
  }
};

/* GET SINGLE BLOG */
export const getBlogById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid blog id" });
  }

  try {
    const blog = await Blog.findById(id)
      .populate("author", "name avatar")
      .populate("comments.user", "name avatar");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error("Get blog error:", error);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

/* UPDATE BLOG*/
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.category = req.body.category;
    blog.tags = req.body.tags?.split(",") || blog.tags;

    if (req.file) {
      blog.cover = `/uploads/blogs/${req.file.filename}`;
    }

    await blog.save();
    res.json(blog);
  } catch {
    res.status(500).json({ message: "Failed to update blog" });
  }
};

/* DELETE BLOG */
export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid blog id" });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};

/* LIKE / UNLIKE BLOG */
export const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const userId = req.user.id;
    const index = blog.likes.indexOf(userId);

    let liked;

    if (index === -1) {
      blog.likes.push(userId);
      liked = true;
    } else {
      blog.likes.splice(index, 1);
      liked = false;
    }

    await blog.save();

    /* 🔔 CREATE NOTIFICATION (ONLY ON LIKE, NOT UNLIKE) */
    if (liked) {
      await Notification.create({
        user: blog.author, // receiver
        fromUser: userId, // actor
        type: "like",
        blog: blog._id,
      });
    }

    const populatedBlog = await Blog.findById(blog._id)
      .populate("author", "name avatar")
      .populate("comments.user", "name avatar");

    res.json(populatedBlog);
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: "Failed to update like" });
  }
};

/* ADD COMMENT */
export const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid blog id" });
  }

  if (!text?.trim()) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.comments.unshift({
      user: req.user.id,
      text: text.trim(),
    });

    await blog.save();

    /* 🔔 CREATE NOTIFICATION */
    await Notification.create({
      user: blog.author, // receiver
      fromUser: req.user.id, // actor
      type: "comment",
      blog: blog._id,
    });

    const updatedBlog = await Blog.findById(blog._id)
      .populate("author", "name avatar")
      .populate("comments.user", "name avatar");

    res.json(updatedBlog.comments);
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

/* EDIT COMMENT */
export const editComment = async (req, res) => {
  const { blogId, commentId } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Comment text required" });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // 🔐 Only comment owner
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.text = text.trim();
    await blog.save();

    const populatedBlog = await Blog.findById(blog._id)
      .populate("author", "name avatar")
      .populate("comments.user", "name avatar");

    res.json(populatedBlog);
  } catch (error) {
    console.error("Edit comment error:", error);
    res.status(500).json({ message: "Failed to edit comment" });
  }
};

/* DELETE COMMENT */
export const deleteComment = async (req, res) => {
  const { blogId, commentId } = req.params;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // 🔐 Comment owner OR blog owner
    if (
      comment.user.toString() !== req.user.id &&
      blog.author.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.deleteOne();
    await blog.save();

    const populatedBlog = await Blog.findById(blog._id)
      .populate("author", "name avatar")
      .populate("comments.user", "name avatar");

    res.json(populatedBlog);
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

/* GET USER FAVORITES */
export const getFavoriteBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ likes: req.user.id })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    console.error("Favorite blogs error:", error);
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};
