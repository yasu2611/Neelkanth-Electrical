import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import { fetchOrders, downloadInvoice } from "../utils/orders";
import "./Profile.css";

function Orders() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // For Details Modal

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchOrders()
      .then(setOrders)
      .catch((err) => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleDownload = async (orderId) => {
    setDownloadingId(orderId);
    try {
      await downloadInvoice(orderId);
    } catch (err) {
      alert(err.message || "Could not download invoice.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (!user) return null;

  return (
    <section className="profile-section">
      <h1 className="profile-title">My Orders</h1>

      <div className="profile-card">
        <h2>Order History</h2>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="profile-empty-orders">
            <p>You haven't placed any orders yet.</p>
            <button onClick={() => navigate("/products")} className="explore-btn">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <p className="order-id">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span
                    className={`order-status status-${order.status
                      ?.toLowerCase()
                      .replace(/\s+/g, "-") || "placed"}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-items-preview">
                  {order.items.map((item, i) => (
                    <span key={i} className="order-item-chip">
                      {item.name} x{item.qty}
                    </span>
                  ))}
                </div>

                <div className="order-card-footer">
                  <p className="order-total">
                    Total: ₹{order.grandTotal?.toLocaleString("en-IN")}
                  </p>
                  <div className="order-actions">
                    <button
                      className="view-btn"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </button>
                    <button
                      className="download-btn"
                      onClick={() => handleDownload(order._id)}
                      disabled={downloadingId === order._id}
                    >
                      {downloadingId === order._id
                        ? "Downloading..."
                        : "Download Invoice PDF"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Order Details (#{selectedOrder._id.slice(-8).toUpperCase()})
              </h3>
              <button
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ✖
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-date">
                <strong>Date:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
              </p>
              <p className="modal-status">
                <strong>Status:</strong> {selectedOrder.status}
              </p>

              <div className="modal-items-list">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="modal-item">
                    <img
                      src={item.image || item.img || "/placeholder.png"}
                      alt={item.name}
                      className="modal-item-img"
                    />
                    <div className="modal-item-info">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.qty}</p>
                      <p>Price: ₹{item.price}</p>
                    </div>
                    <div className="modal-item-total">
                      ₹{item.qty * item.price}
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-summary">
                <p>
                  <strong>Grand Total:</strong> ₹
                  {selectedOrder.grandTotal?.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Orders;