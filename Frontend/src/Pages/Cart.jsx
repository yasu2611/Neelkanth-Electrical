// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Cart.css";
 
// function Cart() {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);
 
//   useEffect(() => {
//     const storedCart = localStorage.getItem("cartItems");
//     if (storedCart) {
//       setCartItems(JSON.parse(storedCart));
//     }
//   }, []);
 
//   const updateQuantity = (index, delta) => {
//     const updatedCart = [...cartItems];
//     const currentItem = updatedCart[index];
 
//     const newQty = (currentItem.qty || 1) + delta;
 
//     if (newQty > 0) {
//       currentItem.qty = newQty;
//     } else {
//       updatedCart.splice(index, 1);
//     }
 
//     setCartItems(updatedCart);
//     localStorage.setItem("cartItems", JSON.stringify(updatedCart));
//   };
 
//   // Nvu function item direct remove karva mate
//   const removeItem = (index) => {
//     const updatedCart = [...cartItems];
//     updatedCart.splice(index, 1);
//     setCartItems(updatedCart);
//     localStorage.setItem("cartItems", JSON.stringify(updatedCart));
//   };
 
//   const handleCheckout = () => {
//     alert("Aapka order successfully place ho gaya hai! 🎉");
//   };
 
//   const subTotal = cartItems.reduce(
//     (sum, item) => sum + item.price * (item.qty || 1),
//     0
//   );
 
//   const cgstRate = 9;
//   const sgstRate = 9;
//   const cgstAmount = (subTotal * cgstRate) / 100;
//   const sgstAmount = (subTotal * sgstRate) / 100;
//   const grandTotal = subTotal + cgstAmount + sgstAmount;
 
//   return (
//     <section className="cart-section">
//       <h1 className="cart-title">Shopping Cart</h1>
 
//       {cartItems.length === 0 ? (
//         <div className="empty-cart">
//           <p>Your cart is feeling a bit empty.</p>
//           <button onClick={() => navigate("/products")} className="explore-btn">
//             Explore Products
//           </button>
//         </div>
//       ) : (
//         <div className="cart-layout">
//           <div className="cart-items-container">
//             {cartItems.map((item, index) => (
//               <div key={item._id || index} className="cart-item">
//                 <div className="item-details-left">
//                   <div className="item-image-wrapper">
//                     <img
//                       src={item.image || "https://via.placeholder.com/120"}
//                       alt={item.name}
//                     />
//                   </div>
//                   <div className="item-info">
//                     <p className="item-name">{item.name}</p>
//                     <p className="item-category">{item.category || "Product"}</p>
//                   </div>
//                 </div>
 
//                 {/* Ahi delete button add karyu che */}
//                 <div className="item-details-right">
//                   <div className="qty-controls">
//                     <button onClick={() => updateQuantity(index, -1)}>−</button>
//                     <span>{item.qty || 1}</span>
//                     <button onClick={() => updateQuantity(index, 1)}>+</button>
//                   </div>
//                   <p className="item-price">
//                     ₹{(item.price * (item.qty || 1)).toLocaleString("en-IN")}
//                   </p>
                 
//                   {/* Delete Icon Button */}
//                   <button
//                     className="delete-btn"
//                     onClick={() => removeItem(index)}
//                     title="Remove item"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
 
//           <div className="cart-bill-container">
//             {/* Bill Code Same Raheshe */}
//             <h2 className="bill-title">Tax Invoice</h2>
//             <div className="bill-items-list">
//               <p className="bill-section-label">Products Breakdown</p>
//               {cartItems.map((item, index) => {
//                 const qty = item.qty || 1;
//                 const itemTotal = item.price * qty;
//                 return (
//                   <div key={index} className="bill-item-row">
//                     <div className="bill-item-name-qty">
//                       <span className="item-title">{item.name}</span>
//                       <span className="item-calc">
//                         {qty} × ₹{item.price.toLocaleString("en-IN")}
//                       </span>
//                     </div>
//                     <span className="item-total-price">
//                       ₹{itemTotal.toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//             <hr className="bill-divider" />
//             <div className="bill-details">
//               <div className="bill-row">
//                 <span>Subtotal</span>
//                 <span>₹{subTotal.toLocaleString("en-IN")}</span>
//               </div>
//               <div className="bill-row tax-row">
//                 <span>CGST ({cgstRate}%)</span>
//                 <span>₹{cgstAmount.toLocaleString("en-IN")}</span>
//               </div>
//               <div className="bill-row tax-row">
//                 <span>SGST ({sgstRate}%)</span>
//                 <span>₹{sgstAmount.toLocaleString("en-IN")}</span>
//               </div>
//               <div className="bill-row grand-total">
//                 <span>Total Amount</span>
//                 <span>₹{grandTotal.toLocaleString("en-IN")}</span>
//               </div>
//             </div>
//             <button onClick={handleCheckout} className="checkout-btn">
//               Genrate Invoice & Checkout
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }
 
// export default Cart;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { fetchCart, updateCartItemQty, removeCartItem, clearCart } from "../utils/cart";
import { placeOrder } from "../utils/orders";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [placingOrder, setPlacingOrder] = useState(false);

  const loadCart = async () => {
    try {
      const items = await fetchCart();
      setCartItems(items || []);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (index, delta) => {
    const item = cartItems[index];
    if (!item) return;
    const newQty = (item.qty || 1) + delta;
    try {
      if (newQty <= 0) {
        await removeCartItem(item.productId);
      } else {
        await updateCartItemQty(item.productId, newQty);
      }
      await loadCart();
    } catch (err) {
      console.error("Failed to update cart item quantity:", err);
    }
  };

  const removeItem = async (index) => {
    const item = cartItems[index];
    if (!item) return;
    try {
      await removeCartItem(item.productId);
      await loadCart();
    } catch (err) {
      console.error("Failed to remove cart item:", err);
    }
  };
 
  const handleCheckout = async () => {
    if (cartItems.length === 0 || placingOrder) return;
    navigate("/checkout");
  };
 
  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );
 
  const cgstRate = 9;
  const sgstRate = 9;
  const cgstAmount = (subTotal * cgstRate) / 100;
  const sgstAmount = (subTotal * sgstRate) / 100;
  const grandTotal = subTotal + cgstAmount + sgstAmount;
 
  return (
    <section className="cart-section">
      <h1 className="cart-title">Shopping Cart</h1>
 
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is feeling a bit empty.</p>
          <button onClick={() => navigate("/products")} className="explore-btn">
            Explore Products
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-container">
            {cartItems.map((item, index) => (
              <div key={item._id || index} className="cart-item">
                <div className="item-details-left">
                  <div className="item-image-wrapper">
                    <img
                      src={item.image || "https://via.placeholder.com/120"}
                      alt={item.name}
                    />
                  </div>
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-category">{item.category || "Product"}</p>
                  </div>
                </div>
 
                <div className="item-details-right">
                  <div className="qty-controls">
                    <button onClick={() => updateQuantity(index, -1)}>−</button>
                    <span>{item.qty || 1}</span>
                    <button onClick={() => updateQuantity(index, 1)}>+</button>
                  </div>
                  <p className="item-price">
                    ₹{(item.price * (item.qty || 1)).toLocaleString("en-IN")}
                  </p>
                 
                  <button
                    className="delete-btn"
                    onClick={() => removeItem(index)}
                    title="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
 
          <div className="cart-bill-container">
            <h2 className="bill-title">Tax Invoice</h2>
            <div className="bill-items-list">
              <p className="bill-section-label">Products Breakdown</p>
              {cartItems.map((item, index) => {
                const qty = item.qty || 1;
                const itemTotal = item.price * qty;
                return (
                  <div key={index} className="bill-item-row">
                    <div className="bill-item-name-qty">
                      <span className="item-title">{item.name}</span>
                      <span className="item-calc">
                        {qty} × ₹{item.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <span className="item-total-price">
                      ₹{itemTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })}
            </div>
            <hr className="bill-divider" />
            <div className="bill-details">
              <div className="bill-row">
                <span>Subtotal</span>
                <span>₹{subTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="bill-row tax-row">
                <span>CGST ({cgstRate}%)</span>
                <span>₹{cgstAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="bill-row tax-row">
                <span>SGST ({sgstRate}%)</span>
                <span>₹{sgstAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="bill-row grand-total">
                <span>Total Amount</span>
                <span>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="checkout-btn" disabled={placingOrder}>
              {placingOrder ? "Processing..." : "Generate Invoice & Checkout"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
 
export default Cart;
