import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, trim: true, default: "" },
    password: { type: String, required: true }, // hashed with bcrypt
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    active: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
