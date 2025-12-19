import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import blogRoutes from "./src/routes/blogRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";

/* Environment */
dotenv.config();

/* Database */
connectDB();

/* App Initialization */
const app = express();

/* Middlewares */
app.use(
  cors({
    origin: "*", // keep open for now (can restrict later)
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Serve uploaded files */
app.use("/uploads", express.static("uploads"));

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

/* Health Check */
app.get("/", (_req, res) => {
  res.send("🚀 Postify API running");
});

/* Global Error Handler */
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

/* Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
