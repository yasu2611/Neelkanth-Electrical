import { getCurrentUser } from "./auth";

const API_URL = "http://localhost:5000/api";

function authHeaders() {
  const user = getCurrentUser();
  return user && user.id ? { "x-user-id": user.id } : {};
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong with the order.");
  }
  return data;
}

// Places an order from the given cart items and generates its invoice PDF.
// items: [{ productId, name, price, image, category, qty }]
export async function placeOrder(items, shippingAddress) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ items, shippingAddress }),
  });
  return handleResponse(res);
}

// Fetches the logged-in user's order history.
export async function fetchOrders() {
  const res = await fetch(`${API_URL}/orders`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function updateOrderStatus(orderId, status) {
  const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

// Returns the direct download URL for an order's invoice PDF.
// Note: this URL relies on the browser having the same-origin session context;
// since auth here is header-based (not cookies), use downloadInvoice() below
// for an actual click-to-download rather than linking directly to this URL.
export function getInvoiceUrl(orderId) {
  return `${API_URL}/orders/${orderId}/pdf`;
}

// Downloads the invoice PDF for an order (handles the x-user-id auth header,
// since a plain <a href> can't attach custom headers).
export async function downloadInvoice(orderId) {
  const res = await fetch(getInvoiceUrl(orderId), { headers: authHeaders() });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to download invoice.");
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Neelkanth-Invoice-${orderId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function viewInvoice(orderId) {
  const res = await fetch(getInvoiceUrl(orderId), { headers: authHeaders() });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to load invoice.");
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => window.URL.revokeObjectURL(url), 20000);
}