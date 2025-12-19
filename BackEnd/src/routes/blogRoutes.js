import express from "express";
import auth from "../middlewares/authMiddleware.js";
import { uploadBlog } from "../middlewares/uploadMiddleware.js";
import {
  createBlog,
  getBlogs,
  getTrendingBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
  editComment,
  deleteComment,
  getFavoriteBlogs,
} from "../controllers/blogController.js";

/* BLOG ROUTES */
const router = express.Router();

/* PUBLIC ROUTES */
router.get("/", getBlogs);
router.get("/trending", getTrendingBlogs);

/* PROTECTED ROUTES */
router.get("/favorites/me", auth, getFavoriteBlogs);
router.post("/", auth, uploadBlog.single("cover"), createBlog);
router.put("/:id", auth, uploadBlog.single("cover"), updateBlog);
router.delete("/:id", auth, deleteBlog);
router.post("/:id/like", auth, toggleLike);
router.post("/:id/comment", auth, addComment);
/* COMMENTS */
router.put("/:blogId/comments/:commentId", auth, editComment);
router.delete("/:blogId/comments/:commentId", auth, deleteComment);

/* PUBLIC (MUST BE LAST) */
router.get("/:id", getBlogById);

export default router;
