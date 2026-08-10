import express from "express";
import User from "../models/User.js";
import { requireUser, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

function toSafeUser(user) {
  if (!user) return null;
  return {
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    username: user.username,
    phone: user.phone,
    address: user.address || "",
    role: user.role,
    status: user.status,
    active: user.active,
    lastLogin: user.lastLogin,
  };
}

// GET /api/users - admin only, list all non-admin users
router.get("/", requireUser, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users.", error: err.message });
  }
});

// GET /api/users/me - return profile details for the current user
router.get("/me", requireUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(toSafeUser(user));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile.", error: err.message });
  }
});

// PUT /api/users/me - update profile fields for the current user
router.put("/me", requireUser, async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;
    const updates = {};

    if (fullName !== undefined) updates.fullName = String(fullName).trim();
    if (phone !== undefined) updates.phone = String(phone).trim();
    if (address !== undefined) updates.address = String(address).trim();

    const updatedUser = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(toSafeUser(updatedUser));
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile.", error: err.message });
  }
});

// DELETE /api/users/:id - admin only
router.delete("/:id", requireUser, requireAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "User deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user.", error: err.message });
  }
});

export default router;
