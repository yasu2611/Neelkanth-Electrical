// import express from "express";
// import path from "path";
// import Order from "../models/Order.js";
// import User from "../models/User.js";
// import { requireUser } from "../middleware/auth.js";
// import { generateInvoicePdf, INVOICES_DIR } from "../utils/generateInvoice.js";
// import { sendInvoiceToWhatsApp } from "../utils/whatsapp.js"; // 👈 Imported WhatsApp utility

// const router = express.Router();
// const ADMIN_PHONE = "917600333394"; // Your WhatsApp number

// router.use(requireUser);

// // POST /api/orders - place an order from the given cart items, generate its PDF invoice, & send to WhatsApp
// // body: { items: [{ productId, name, price, image, category, qty }] }
// router.post("/", async (req, res) => {
//   try {
//     const { items, shippingAddress } = req.body;
//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "Cart is empty." });
//     }
//     if (!shippingAddress || !shippingAddress.trim()) {
//       return res.status(400).json({ message: "Shipping address is required." });
//     }

//     const subTotal = items.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
//     const cgstRate = 9;
//     const sgstRate = 9;
//     const cgstAmount = Number(((subTotal * cgstRate) / 100).toFixed(2));
//     const sgstAmount = Number(((subTotal * sgstRate) / 100).toFixed(2));
//     const grandTotal = Number((subTotal + cgstAmount + sgstAmount).toFixed(2));

//     const order = await Order.create({
//       userId: req.userId,
//       items,
//       subTotal,
//       cgstRate,
//       sgstRate,
//       cgstAmount,
//       sgstAmount,
//       grandTotal,
//       shippingAddress: shippingAddress.trim(),
//       invoiceFile: "pending.pdf", // placeholder, updated right after PDF is generated
//     });

//     const user = await User.findById(req.userId);
//     const fileName = generateInvoicePdf(order, user);

//     order.invoiceFile = fileName;
//     await order.save();

//     // 🚀 Send WhatsApp message + PDF attachment to your phone number
//     sendInvoiceToWhatsApp(ADMIN_PHONE, order, user);

//     res.status(201).json(order);
//   } catch (err) {
//     res.status(400).json({ message: "Failed to place order.", error: err.message });
//   }
// });

// // GET /api/orders - returns the current user's order history, or all orders for admin users
// // GET /api/orders - returns current user's order history, or all orders for admin users
// router.get("/", async (req, res) => {
//   try {
//     // 1. Check if auth middleware attached valid user data
//     if (!req.userId && req.userRole !== "admin") {
//       return res.status(401).json({ message: "Unauthorized: Missing user authentication." });
//     }

//     const query = req.userRole === "admin" ? {} : { userId: req.userId };
    
//     const orders = await Order.find(query)
//       .sort({ createdAt: -1 })
//       .populate("userId", "fullName username email");

//     res.json(orders);
//   } catch (err) {
//     // 2. Log full error to Render Dashboard logs for easy debugging
//     console.error("GET /api/orders failed with error:", err);
    
//     res.status(500).json({ 
//       message: "Failed to fetch orders.", 
//       error: err.message 
//     });
//   }
// });

// // PUT /api/orders/:id/status - admin can update order status
// router.put("/:id/status", async (req, res) => {
//   try {
//     if (req.userRole !== "admin") {
//       return res.status(403).json({ message: "Admin access required." });
//     }

//     const { status } = req.body;
//     const validStatuses = ["Placed", "Pending", "Work In Progress", "Complete", "Processing", "Delivered", "Cancelled"];

//     if (!status || !validStatuses.includes(status)) {
//       return res.status(400).json({ message: "Invalid status." });
//     }

//     const updatedOrder = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true, runValidators: true }
//     ).populate("userId", "fullName username email");

//     if (!updatedOrder) {
//       return res.status(404).json({ message: "Order not found." });
//     }

//     res.json(updatedOrder);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to update order status.", error: err.message });
//   }
// });

// // GET /api/orders/:id/pdf - download the invoice PDF for one of the user's own orders, or any order if admin
// router.get("/:id/pdf", async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found." });
//     }
//     if (req.userRole !== "admin" && order.userId.toString() !== req.userId) {
//       return res.status(403).json({ message: "Access denied." });
//     }
//     const filePath = path.join(INVOICES_DIR, order.invoiceFile);
//     res.download(filePath, `Neelkanth-Invoice-${order._id}.pdf`);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to download invoice.", error: err.message });
//   }
// });

// export default router;
import express from "express";
import path from "path";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { requireUser } from "../middleware/auth.js";
import { generateInvoicePdf, INVOICES_DIR } from "../utils/generateInvoice.js";
import { sendInvoiceToWhatsApp } from "../utils/whatsapp.js";

const router = express.Router();
const ADMIN_PHONE = "917600333394";

router.use(requireUser);

// POST /api/orders - place an order from given cart items
router.post("/", async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }
    if (!shippingAddress || !shippingAddress.trim()) {
      return res.status(400).json({ message: "Shipping address is required." });
    }

    const subTotal = items.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
    const cgstRate = 9;
    const sgstRate = 9;
    const cgstAmount = Number(((subTotal * cgstRate) / 100).toFixed(2));
    const sgstAmount = Number(((subTotal * sgstRate) / 100).toFixed(2));
    const grandTotal = Number((subTotal + cgstAmount + sgstAmount).toFixed(2));

    const order = await Order.create({
      userId: req.userId,
      items,
      subTotal,
      cgstRate,
      sgstRate,
      cgstAmount,
      sgstAmount,
      grandTotal,
      shippingAddress: shippingAddress.trim(),
      invoiceFile: "pending.pdf",
    });

    const user = await User.findById(req.userId);
    const fileName = generateInvoicePdf(order, user);

    order.invoiceFile = fileName;
    await order.save();

    sendInvoiceToWhatsApp(ADMIN_PHONE, order, user);

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: "Failed to place order.", error: err.message });
  }
});

// GET /api/orders - returns user's order history, or all orders for admin
router.get("/", async (req, res) => {
  try {
    if (!req.userId && req.userRole !== "admin") {
      return res.status(401).json({ message: "Unauthorized: Missing user authentication." });
    }

    const query = req.userRole === "admin" ? {} : { userId: req.userId };
    
    // Explicitly reference the User model object inside populate to guarantee Mongoose registers it
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "fullName username email",
        model: User
      });

    res.json(orders);
  } catch (err) {
    console.error("GET /api/orders Error Details:", err);
    res.status(500).json({ 
      message: "Failed to fetch orders.", 
      error: err.message 
    });
  }
});

// PUT /api/orders/:id/status - update order status
router.put("/:id/status", async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Admin access required." });
    }

    const { status } = req.body;
    const validStatuses = ["Placed", "Pending", "Work In Progress", "Complete", "Processing", "Delivered", "Cancelled"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate({
      path: "userId",
      select: "fullName username email",
      model: User
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status.", error: err.message });
  }
});

// GET /api/orders/:id/pdf - download PDF invoice
router.get("/:id/pdf", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    if (req.userRole !== "admin" && order.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Access denied." });
    }
    const filePath = path.join(INVOICES_DIR, order.invoiceFile);
    res.download(filePath, `Neelkanth-Invoice-${order._id}.pdf`);
  } catch (err) {
    res.status(500).json({ message: "Failed to download invoice.", error: err.message });
  }
});

export default router;