import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

function toSafeUser(user) {
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

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, phone, password, address } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "Please complete all fields." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password should be at least 6 characters." });
    }

    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (existing) {
      return res.status(409).json({ message: "An account with this email or phone already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email.split("@")[0];

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      username,
      phone: phone.trim(),
      address: address?.trim() || "",
      password: hashedPassword,
      role: "customer",
    });

    res.status(201).json(toSafeUser(user));
  } catch (err) {
    res.status(500).json({ message: "Unable to create account.", error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { query, password } = req.body;
    if (!query || !password) {
      return res.status(400).json({ message: "Enter your username/email and password." });
    }

    const user = await User.findOne({
      $or: [{ email: query.toLowerCase() }, { username: query }, { fullName: query }],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username/email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username/email or password." });
    }

    if (user.active === false || user.status !== "Active") {
      return res.status(403).json({ message: "This account is not active." });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json(toSafeUser(user));
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
});

export default router;
