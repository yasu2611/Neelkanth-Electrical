import express from "express";
import Inquiry from "../models/Inquiry.js";
import { optionalUser, requireUser, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// POST /api/inquiries - anyone can submit (logged in or guest)
router.post("/", optionalUser, async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name || !phone || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const inquiry = await Inquiry.create({
      userId: req.userId || null,
      name,
      phone,
      email,
      message,
    });
    res.status(201).json(inquiry);
  } catch (err) {
    res.status(400).json({ message: "Unable to send message. Please try again.", error: err.message });
  }
});

// GET /api/inquiries - admin only
router.get("/", requireUser, requireAdmin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch inquiries.", error: err.message });
  }
});

// DELETE /api/inquiries/:id - admin only
router.delete("/:id", requireUser, requireAdmin, async (req, res) => {
  try {
    const deleted = await Inquiry.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Inquiry not found." });
    }
    res.json({ message: "Inquiry deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete inquiry.", error: err.message });
  }
});

export default router;
