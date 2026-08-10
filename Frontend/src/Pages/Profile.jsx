import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, setCurrentUser } from "../utils/auth";
import { updateUserProfile } from "../utils/api";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [editMode, setEditMode] = useState(false);
  const [address, setAddress] = useState(user?.address || "");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const refreshUser = () => {
    const latestUser = getCurrentUser();
    setUser(latestUser);
    setAddress(latestUser?.address || "");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!address.trim()) {
      setMessage("Address cannot be empty.");
      setMessageType("error");
      return;
    }

    try {
      setSaving(true);
      const updated = await updateUserProfile({ address: address.trim() });
      setCurrentUser(updated);
      setUser(updated);
      setMessage("Address updated successfully.");
      setMessageType("success");
      setEditMode(false);
    } catch (err) {
      setMessage(err.message || "Failed to save address.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="profile-section">
      <h1 className="profile-title">My Profile</h1>

      <div className="profile-card">
        <div className="profile-card-header">
          <h2>Account Details</h2>
          <button
            className="edit-profile-btn"
            onClick={() => setEditMode((prev) => !prev)}
          >
            {editMode ? "Cancel" : "Edit Address"}
          </button>
        </div>

        {message && (
          <div className={`profile-message ${messageType}`}>{message}</div>
        )}

        {editMode ? (
          <form className="profile-form" onSubmit={handleSave}>
            <div className="profile-form-row">
              <label>Email</label>
              <input type="email" value={user.email} readOnly />
            </div>
            <div className="profile-form-row">
              <label>Phone</label>
              <input type="text" value={user.phone || ""} readOnly />
            </div>
            <div className="profile-form-row">
              <label>Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
              />
            </div>
            <button type="submit" className="save-profile-btn" disabled={saving}>
              {saving ? "Saving..." : "Save Address"}
            </button>
          </form>
        ) : (
          <div className="profile-details-grid">
            <div>
              <span className="detail-label">Full Name</span>
              <p>{user.fullName || user.username || user.name}</p>
            </div>
            <div>
              <span className="detail-label">Email</span>
              <p>{user.email}</p>
            </div>
            <div>
              <span className="detail-label">Phone</span>
              <p>{user.phone || "N/A"}</p>
            </div>
            <div className="profile-address-box">
              <span className="detail-label">Address</span>
              <p>{user.address || "No address saved yet."}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Profile;