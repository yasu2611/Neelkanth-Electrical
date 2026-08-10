import express from "express";
import Cart from "../models/Cart.js";
import { requireUser } from "../middleware/auth.js";

const router = express.Router();

// All cart routes require a logged-in user.
router.use(requireUser);

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
}

// GET /api/cart - fetch current user's cart
router.get("/", async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.userId);
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart.", error: err.message });
  }
});

// POST /api/cart - add an item (or increment qty if it already exists)
// body: { productId, name, price, image, category, qty }
router.post("/", async (req, res) => {
  try {
    const { productId, name, price, image, category, qty } = req.body;
    if (!productId || !name || price === undefined) {
      return res.status(400).json({ message: "productId, name and price are required." });
    }

    const cart = await getOrCreateCart(req.userId);
    const existing = cart.items.find((item) => item.productId.toString() === productId);

    if (existing) {
      existing.qty += qty || 1;
    } else {
      cart.items.push({ productId, name, price, image, category, qty: qty || 1 });
    }

    await cart.save();
    res.status(201).json(cart.items);
  } catch (err) {
    res.status(400).json({ message: "Failed to add item to cart.", error: err.message });
  }
});

// PUT /api/cart/:productId - set the quantity for one item (removes it if qty <= 0)
// body: { qty }
router.put("/:productId", async (req, res) => {
  try {
    const { qty } = req.body;
    const cart = await getOrCreateCart(req.userId);
    const item = cart.items.find((i) => i.productId.toString() === req.params.productId);

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    if (qty <= 0) {
      cart.items = cart.items.filter((i) => i.productId.toString() !== req.params.productId);
    } else {
      item.qty = qty;
    }

    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(400).json({ message: "Failed to update cart item.", error: err.message });
  }
});

// DELETE /api/cart/:productId - remove one item
router.delete("/:productId", async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.userId);
    cart.items = cart.items.filter((i) => i.productId.toString() !== req.params.productId);
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove cart item.", error: err.message });
  }
});

// DELETE /api/cart - clear the whole cart (used after checkout)
router.delete("/", async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.userId);
    cart.items = [];
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart.", error: err.message });
  }
});

// POST /api/cart/merge - merge a guest (localStorage) cart into the account on login
// body: { items: [{ productId, name, price, image, category, qty }] }
router.post("/merge", async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "items must be an array." });
    }

    const cart = await getOrCreateCart(req.userId);

    for (const guestItem of items) {
      const existing = cart.items.find((i) => i.productId.toString() === guestItem.productId);
      if (existing) {
        existing.qty += guestItem.qty || 1;
      } else {
        cart.items.push({ ...guestItem, qty: guestItem.qty || 1 });
      }
    }

    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(400).json({ message: "Failed to merge cart.", error: err.message });
  }
});

export default router;
