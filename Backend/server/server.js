// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import productRoutes from "./routes/products.js";
// import authRoutes from "./routes/auth.js";
// import cartRoutes from "./routes/cart.js";
// import userRoutes from "./routes/users.js";
// import inquiryRoutes from "./routes/inquiries.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Allow the Vite dev server (localhost:5173) to call this API
// app.use(cors());
// app.use(express.json({ limit: "10mb" })); // higher limit since product images are sent as base64

// app.use("/api/products", productRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/inquiries", inquiryRoutes);

// app.get("/", (req, res) => {
//   res.send("Neelkanth API is running");
// });

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected");
//     app.listen(PORT, () => {
//       console.log(`✅ Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection failed:", err.message);
//   });
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import cartRoutes from "./routes/cart.js";
import userRoutes from "./routes/users.js";
import inquiryRoutes from "./routes/inquiries.js";
import orderRoutes from "./routes/orders.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the Vite dev server (localhost:5173) to call this API
app.use(cors());
app.use(express.json({ limit: "10mb" })); // higher limit since product images are sent as base64

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Neelkanth API is running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });