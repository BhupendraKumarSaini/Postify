import express from "express";
import auth from "../middlewares/authMiddleware.js";
import { uploadUser } from "../middlewares/uploadMiddleware.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

/* USER ROUTES */
const router = express.Router();

/* @route   GET /api/users/me */
router.get("/me", auth, getProfile);

/* @route   PUT /api/users/me */
router.put("/me", auth, uploadUser.single("avatar"), updateProfile);

export default router;
