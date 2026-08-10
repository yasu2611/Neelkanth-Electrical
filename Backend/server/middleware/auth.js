import User from "../models/User.js";

// Simple, no-JWT auth: the frontend sends the logged-in user's Mongo _id
// in the "x-user-id" header on every request that needs to know who's
// logged in (same trust model as the old localStorage-only setup, just
// backed by a real database now instead of purely client-side storage).
export async function requireUser(req, res, next) {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({ message: "Please log in." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Please log in again." });
    }
    req.userId = user._id.toString();
    req.userRole = user.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Please log in again." });
  }
}

// Doesn't block the request if there's no user - just attaches userId if present.
export async function optionalUser(req, res, next) {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    req.userId = null;
    return next();
  }
  try {
    const user = await User.findById(userId);
    req.userId = user ? user._id.toString() : null;
  } catch (err) {
    req.userId = null;
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }
  next();
}
