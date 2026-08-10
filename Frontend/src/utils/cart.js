import { getCurrentUser } from "./auth";

const API_URL = "http://localhost:5000/api";
const GUEST_CART_KEY = "guestCartItems";

function authHeaders() {
  const user = getCurrentUser();
  return user && user.id ? { "x-user-id": user.id } : {};
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong with the cart.");
  }
  return data;
}

function isLoggedIn() {
  const user = getCurrentUser();
  return !!(user && user.id);
}

// ------------------ Guest cart (localStorage, used only when logged out) ------------------

function getGuestCart() {
  try {
    const storedItems = localStorage.getItem(GUEST_CART_KEY);
    if (storedItems) {
      return JSON.parse(storedItems) || [];
    }

    const legacyItems = localStorage.getItem("cartItems");
    if (legacyItems) {
      const parsed = JSON.parse(legacyItems);
      if (Array.isArray(parsed)) {
        saveGuestCart(parsed);
        localStorage.removeItem("cartItems");
        return parsed;
      }
    }

    return [];
  } catch {
    return [];
  }
}

function saveGuestCart(items) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

function clearGuestCart() {
  localStorage.removeItem(GUEST_CART_KEY);
}

// ------------------ Public cart API ------------------
// These functions work the same way whether the user is logged in
// (backend-backed) or a guest (localStorage-backed), so components
// like Cart.jsx, Navbar.jsx, product.jsx don't need to know which.

export async function fetchCart() {
  if (!isLoggedIn()) {
    return getGuestCart();
  }
  const res = await fetch(`${API_URL}/cart`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function addToCart(product) {
  const item = {
    productId: product._id || product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    qty: 1,
  };

  if (!isLoggedIn()) {
    const cart = getGuestCart();
    const existing = cart.find((i) => i.productId === item.productId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push(item);
    }
    saveGuestCart(cart);
    return cart;
  }

  const res = await fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(item),
  });
  return handleResponse(res);
}

export async function updateCartItemQty(productId, qty) {
  if (!isLoggedIn()) {
    let cart = getGuestCart();
    if (qty <= 0) {
      cart = cart.filter((i) => i.productId !== productId);
    } else {
      const item = cart.find((i) => i.productId === productId);
      if (item) item.qty = qty;
    }
    saveGuestCart(cart);
    return cart;
  }

  const res = await fetch(`${API_URL}/cart/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ qty }),
  });
  return handleResponse(res);
}

export async function removeCartItem(productId) {
  if (!isLoggedIn()) {
    const cart = getGuestCart().filter((i) => i.productId !== productId);
    saveGuestCart(cart);
    return cart;
  }

  const res = await fetch(`${API_URL}/cart/${productId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function clearCart() {
  if (!isLoggedIn()) {
    clearGuestCart();
    return [];
  }
  const res = await fetch(`${API_URL}/cart`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// Call this right after a successful login/register so any items added
// as a guest get folded into the user's real cart.
export async function mergeGuestCartOnLogin() {
  const guestItems = getGuestCart();
  if (guestItems.length === 0) return;

  const res = await fetch(`${API_URL}/cart/merge`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ items: guestItems }),
  });
  await handleResponse(res);
  clearGuestCart();
}
