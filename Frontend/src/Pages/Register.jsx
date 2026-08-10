import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import { registerUser } from "../utils/api";
 
function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
 
  useEffect(() => {
    if (getCurrentUser()) {
      navigate("/");
    }
  }, [navigate]);
 
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePhone = (value) => /^\d{7,15}$/.test(value.trim());
 
  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");
 
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setMessage("Please complete all fields.");
      setMessageType("error");
      return;
    }
 
    if (!validateEmail(email)) {
      setMessage("Enter a valid email address.");
      setMessageType("error");
      return;
    }
 
    if (!validatePhone(phone)) {
      setMessage("Phone number should be 7 to 15 digits.");
      setMessageType("error");
      return;
    }
 
    if (password.length < 6) {
      setMessage("Password should be at least 6 characters.");
      setMessageType("error");
      return;
    }
 
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }
 
    try {
      await registerUser({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role: "customer",
        status: "Active",
        active: true,
        lastLogin: null,
      });
 
      setMessage("Account created successfully. Redirecting to login...");
      setMessageType("success");
 
      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (error) {
      setMessage(error.message || "Unable to create account.");
      setMessageType("error");
    }
  };
 
  return (
<>
<div className="auth-page">
<div className="auth-card">
<h1 className="auth-title">Create Account</h1>
<p className="auth-subtitle">
            Register now to access your dashboard and customer experience.
</p>
 
          {message && (
<div className={`auth-feedback ${messageType}`}>{message}</div>
          )}
 
          <form onSubmit={handleRegister}>
<input
              className="auth-input"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
 
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
 
            <input
              className="auth-input"
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
 
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
 
            <input
              className="auth-input"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
 
            <button className="auth-button" type="submit">
              Create Account
</button>
</form>
 
          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
</p>
</div>
</div>
 
      {/* અહી નીચે બધું જ CSS ઉમેરવામાં આવ્યું છે */}
<style>{`
        /* આખા પેજનું સેટિંગ */
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
          padding: 1.5rem;
          font-family: system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
        }
 
        /* કાર્ડનું સેટિંગ (મોબાઈલ માટે ડિફોલ્ટ) */
        .auth-card {
          width: 100%;
          max-width: 95%;
          background: #ffffff;
          border-radius: 1.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          padding: 2rem 1.5rem;
          box-sizing: border-box;
        }
 
        /* ટેબ્લેટ અને મધ્યમ સ્ક્રીન માટે */
        @media (min-width: 640px) {
          .auth-card {
            max-width: 450px;
            padding: 2.5rem;
          }
        }
 
        /* મોટા ટેબ્લેટ અને ફોલ્ડેબલ સ્ક્રીન (iPad, Fold) માટે */
        @media (min-width: 768px) {
          .auth-card {
            max-width: 500px;
            padding: 3rem;
          }
        }
 
        /* મોટા લેપટોપ સ્ક્રીન માટે */
        @media (min-width: 1024px) {
          .auth-card {
            max-width: 550px; /* ફોર્મ બહુ લાંબુ ન લાગે એટલે મહત્તમ 550px રાખ્યું છે */
          }
        }
 
        /* ટાઈટલ અને સબટાઈટલ */
        .auth-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #111827;
          text-align: center;
          margin-top: 0;
          margin-bottom: 0.5rem;
        }
 
        .auth-subtitle {
          font-size: 0.95rem;
          color: #6b7280;
          text-align: center;
          margin-bottom: 2rem;
          line-height: 1.4;
        }
 
        /* એરર/સક્સેસ મેસેજ */
        .auth-feedback {
          padding: 1rem;
          border-radius: 0.75rem;
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
        }
        .auth-feedback.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }
        .auth-feedback.success {
          background: #f0fdf4;
          color: #047857;
          border: 1px solid #a7f3d0;
        }
 
        /* ફોર્મ અને ઇનપુટ બોક્સ */
        form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
 
        .auth-input {
          width: 100%;
          padding: 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.75rem;
          font-size: 1rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
 
        .auth-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }
 
        /* બટન */
        .auth-button {
          width: 100%;
          padding: 1rem;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: background-color 0.2s;
        }
 
        .auth-button:hover {
          background-color: #1d4ed8;
        }
 
        /* નીચેની લિંક */
        .auth-footer {
          text-align: center;
          margin-top: 1.75rem;
          font-size: 0.95rem;
          color: #4b5563;
        }
 
        .auth-footer a {
          color: #2563eb;
          font-weight: 700;
          text-decoration: none;
        }
 
        .auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
</>
  );
}
 
export default Register;