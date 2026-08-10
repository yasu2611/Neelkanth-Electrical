import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    category: { type: String, default: "" },
    qty: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    subTotal: { type: Number, required: true },
    cgstRate: { type: Number, required: true, default: 9 },
    sgstRate: { type: Number, required: true, default: 9 },
    cgstAmount: { type: Number, required: true },
    sgstAmount: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    // File name of the generated invoice PDF, stored under /invoices on disk.
    invoiceFile: { type: String, required: true },
    status: { type: String, enum: ["Placed", "Pending", "Work In Progress", "Complete", "Processing", "Delivered", "Cancelled"], default: "Placed" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;