import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, setCurrentUser } from "../utils/auth";
import { fetchCart, clearCart } from "../utils/cart";
import { placeOrder } from "../utils/orders";
import { updateUserProfile, fetchUserProfile } from "../utils/api";
import "./Checkout.css";

function parseSavedAddress(savedAddress) {
  if (!savedAddress) return {};
  const parts = savedAddress
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return {};

  const lastPart = parts[parts.length - 1];
  let city = "";
  let state = "";
  let pincode = "";

  const dashParts = lastPart.split("-").map((part) => part.trim());
  if (dashParts.length >= 2) {
    pincode = dashParts.pop();
    const cityState = dashParts.join("-").trim();
    const cityStateParts = cityState.split(",").map((part) => part.trim());
    city = cityStateParts[0] || "";
    state = cityStateParts.slice(1).join(", ") || "";
  } else {
    const cityStateParts = lastPart.split(",").map((part) => part.trim());
    city = cityStateParts[0] || "";
    state = cityStateParts[1] || "";
  }

  const addressParts = parts.slice(0, parts.length - 1);
  return {
    address1: addressParts[0] || "",
    address2: addressParts.slice(1).join(", ") || "",
    city,
    state,
    pincode,
  };
}

function Checkout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  
  // Shipping details state
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    async function loadCheckoutData() {
      try {
        const profile = await fetchUserProfile();
        setUser(profile);
        setCurrentUser(profile);

        const parsed = parseSavedAddress(profile.address || "");
        setAddress1(parsed.address1 || "");
        setAddress2(parsed.address2 || "");
        setCity(parsed.city || "");
        setState(parsed.state || "");
        setPincode(parsed.pincode || "");
      } catch (err) {
        console.warn("Could not refresh profile before checkout:", err);
        setUser(currentUser);

        const parsed = parseSavedAddress(currentUser.address || "");
        setAddress1(parsed.address1 || "");
        setAddress2(parsed.address2 || "");
        setCity(parsed.city || "");
        setState(parsed.state || "");
        setPincode(parsed.pincode || "");
      }

      try {
        const items = await fetchCart();
        setCartItems(items || []);
      } catch (err) {
        console.error("Failed to load cart for checkout:", err);
        setError("Unable to load your cart. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadCheckoutData();
  }, [navigate]);

  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );
  const cgstRate = 9;
  const sgstRate = 9;
  const cgstAmount = (subTotal * cgstRate) / 100;
  const sgstAmount = (subTotal * sgstRate) / 100;
  const grandTotal = subTotal + cgstAmount + sgstAmount;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (placingOrder) return;

    if (!address1.trim() || !city.trim() || !state || !pincode.trim()) {
      setError("Please complete all required address fields.");
      return;
    }

    // Combine structured address into single shipping address string
    const fullShippingAddress = [
      address1.trim(),
      address2.trim(),
      `${city.trim()}, ${state} - ${pincode.trim()}`
    ].filter(Boolean).join(", ");

    setError(null);
    setPlacingOrder(true);

    try {
      const updatedUser = await updateUserProfile({ address: fullShippingAddress });
      setCurrentUser(updatedUser);
      setUser(updatedUser);
      await placeOrder(cartItems, fullShippingAddress);
      await clearCart();
      alert("🎉 Order placed successfully! Your invoice PDF is ready and you are being redirected home.");
      navigate("/");
    } catch (err) {
      console.error("Checkout failed:", err);
      setError(err.message || "Unable to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <section className="checkout-section">
        <p>Loading checkout details…</p>
      </section>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <section className="checkout-section">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-grid">
        <div className="checkout-form-card">
          <h2>Shipping Details</h2>
          <form onSubmit={handlePlaceOrder}>
            <div className="checkout-field">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={user.fullName || user.username}
                readOnly
              />
            </div>

            <div className="form-row">
              <div className="checkout-field half-width">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={user.email}
                  readOnly
                />
              </div>
              <div className="checkout-field half-width">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={user.phone}
                  readOnly
                />
              </div>
            </div>

            <div className="checkout-field">
              <label htmlFor="address1">House/Flat No. & Building</label>
              <input
                type="text"
                id="address1"
                placeholder="Flat No. 12, XYZ Apartments"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="address2">Street/Area & Landmark</label>
              <input
                type="text"
                id="address2"
                placeholder="Near Main Market, MG Road"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="checkout-field third-width">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  placeholder="Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="checkout-field third-width">
                <label htmlFor="state">State</label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                >
                  <option value="">Select State</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>
              <div className="checkout-field third-width">
                <label htmlFor="pincode">Pincode</label>
                <input
                  type="number"
                  id="pincode"
                  placeholder="400001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <p className="checkout-error">{error}</p>}

            <button
              type="submit"
              className="checkout-place-order-btn"
              disabled={placingOrder || cartItems.length === 0}
            >
              {placingOrder ? "Placing Order..." : "Proceed to Payment & Place Order"}
            </button>
            <button
              type="button"
              className="checkout-back-btn"
              onClick={() => navigate("/cart")}
            >
              Back to Cart
            </button>
          </form>
        </div>

        <div className="checkout-summary-card">
          <h2>Order Summary</h2>
          {cartItems.length === 0 ? (
            <div className="checkout-empty-cart">
              <p>Your cart is empty.</p>
              <button onClick={() => navigate("/products")}>Shop Products</button>
            </div>
          ) : (
            <>
              <div className="checkout-items-list">
                {cartItems.map((item, index) => (
                  <div key={item.productId || index} className="checkout-item-row">
                    <span>{item.name} × {item.qty || 1}</span>
                    <span>₹{(item.price * (item.qty || 1)).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
              <hr />
              <div className="checkout-summary-row">
                <span>Subtotal</span>
                <span>₹{subTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="checkout-summary-row">
                <span>CGST ({cgstRate}%)</span>
                <span>₹{cgstAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="checkout-summary-row">
                <span>SGST ({sgstRate}%)</span>
                <span>₹{sgstAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="checkout-summary-row total-row">
                <span>Total Amount</span>
                <span>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Checkout;