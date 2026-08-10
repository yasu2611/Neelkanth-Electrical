// One-off script to create the default admin account.
// Run with: node seedAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const DEFAULT_ADMIN = {
  fullName: "Administrator",
  email: "admin@example.com",
  username: "admin",
  phone: "0000000000",
  password: "admin123", // change this after first login
  role: "admin",
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({
    $or: [{ username: DEFAULT_ADMIN.username }, { email: DEFAULT_ADMIN.email }],
  });

  if (existing) {
    console.log("Admin user already exists. Skipping.");
  } else {
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
    await User.create({ ...DEFAULT_ADMIN, password: hashedPassword });
    console.log("✅ Default admin created — username: admin / password: admin123");
    console.log("⚠️  Please log in and change this password.");
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
