import User from "../models/User.js";
import Blog from "../models/Blog.js";

/* GET USER PROFILE */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const blogs = await Blog.find({ author: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({ user, blogs });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* UPDATE USER PROFILE */
export const updateProfile = async (req, res) => {
  try {
    const updates = {};

    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.bio !== undefined) updates.bio = req.body.bio;

    if (req.file) {
      updates.avatar = `/uploads/users/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
