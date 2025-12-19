import express from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  getNotifications,
  markAllAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

/* PROTECTED */
router.get("/", auth, getNotifications);
router.put("/read", auth, markAllAsRead);

export default router;
