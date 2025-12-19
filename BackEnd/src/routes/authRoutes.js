import express from "express";
import { login, register } from "../controllers/authController.js";

/* AUTH ROUTES */
const router = express.Router();

/* @route   POST /api/auth/register */
router.post("/register", register);

/* @route   POST /api/auth/login */
router.post("/login", login);

export default router;
