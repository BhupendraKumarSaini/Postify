import express from "express";
import auth from "../middlewares/authMiddleware.js";
import { getComments, addComment } from "../controllers/commentController.js";

/* COMMENT ROUTES */
const router = express.Router();

/* ROUTES */
router.get("/:blogId", getComments);
router.post("/:blogId", auth, addComment);

export default router;
