import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchCart } from '../utils/cart';
import { getCurrentUser, clearCurrentUser } from '../utils/auth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    const isRegularUser = currentUser && currentUser.role !== "admin";

    if (isRegularUser) {
      setUserName(currentUser.fullName || currentUser.name || currentUser.email);
    } else {
      setUserName("");
    }

    const loadCartCount = async () => {
      try {
        const items = await fetchCart();
        const count = items.reduce((sum, item) => sum + Number(item.qty || 1), 0);
        setCartCount(count);
      } catch (err) {
        console.error("Failed to load cart count:", err);
        setCartCount(0);
      }
    };

    loadCartCount();

    const onCartUpdated = () => {
      loadCartCount();
    };

    window.addEventListener("cartUpdated", onCartUpdated);
    return () => window.removeEventListener("cartUpdated", onCartUpdated);
  }, [location.pathname]);

  const logout = () => {
    clearCurrentUser();
    setUserName("");
    setDropdownOpen(false);
    navigate("/", { replace: true });
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <style>{`
        /* =========================================
           DESKTOP NAVBAR
           ========================================= */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 5%;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          background-color: #ffffff;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .logo h1 {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
          margin: 0;
          white-space: nowrap;
        }
        .nav-links a {
          text-decoration: none;
          color: #1f2937;
          margin: 0 1.2rem;
          font-weight: 600;
          transition: color 0.3s;
        }
        .nav-links a:hover, .nav-links a.active {
          color: #1a56db;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 25px;
        }
        .contact-number {
          font-weight: 700;
          font-size: 1.1rem;
          color: #1f2937;
        }
        .cart-container {
          position: relative;
          text-decoration: none;
          display: flex;
          align-items: center;
          transition: transform 0.2s ease;
          cursor: pointer;
        }
        .cart-container:hover {
          transform: scale(1.1);
        }
        .cart-icon {
          font-size: 1.6rem;
        }
        .cart-badge {
          position: absolute;
          top: -6px;
          right: -10px;
          background-color: #ff3b30;
          color: white;
          font-size: 12px;
          font-weight: 700;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        .login-btn {
          text-decoration: none;
          color: black;
          background: #e4e4e1;
          padding: 8px 18px;
          border-radius: 8px;
          font-weight: bold;
          white-space: nowrap;
        }
        .user {
          position: relative;
        }
        .user-btn {
          border: none;
          background: none;
          color: #f5b400;
          cursor: pointer;
          font-size: 15px;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .dropdown {
          position: absolute;
          right: 0;
          top: 40px;
          background: #222;
          border-radius: 10px;
          min-width: 150px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0, 0, 0, .3);
          opacity: 0;
          transform: translateY(-10px);
          visibility: hidden;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .dropdown.open {
          opacity: 1;
          transform: translateY(0);
          visibility: visible;
        }
        .dropdown a, .dropdown button {
          display: block;
          width: 100%;
          padding: 12px;
          color: white;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          text-decoration: none;
          font-size: 15px;
        }
        .dropdown a:hover, .dropdown button:hover {
          background: #939392;
          color: black;
        }
        .menu-btn {
          display: none;
          font-size: 1.8rem;
          cursor: pointer;
          color: #1f2937;
          user-select: none;
        }

        /* =========================================
           TABLET NAVBAR FIX (iPad, Fold)
           ========================================= */
        @media (max-width: 1024px) {
          .header {
            flex-direction: row;       
            flex-wrap: nowrap;         
            justify-content: space-between; 
            padding: 1rem 4%;
            gap: 10px;                 
          }
          
          .logo {
            order: 1;
            flex-shrink: 1;            
          }
          .logo h1 {
            font-size: 1.8rem;         
          }
          
          .nav-right {
            order: 2;
            gap: 15px;                 
            margin-left: auto;         
          }
          
          .menu-btn {
            display: block;
            order: 3;
            margin-left: 5px;          
          }
          
          .contact-number {
            display: none;             
          }

          .user-btn {
            max-width: 200px;          
            overflow: hidden;
            text-overflow: ellipsis;   
            white-space: nowrap;
            font-size: 14px;
          }

          .login-btn {
            padding: 6px 14px;         
            font-size: 14px;
          }

          /* Transparent Overlay Menu */
          .nav-links {
            display: none;
            position: absolute;               
            top: 100%;                        
            left: 0;
            width: 100%;
            flex-direction: column;
            text-align: center;
            background-color: rgba(255, 255, 255, 0.95); 
            backdrop-filter: blur(8px);       
            padding: 1rem 0;
            box-shadow: 0 10px 15px rgba(0,0,0,0.1);
            border-radius: 0 0 12px 12px;
            z-index: 99;                      
          }
          .nav-links.open {
            display: flex;
          }
          .nav-links a {
            padding: 12px 0;
            margin: 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05); 
            width: 100%;
          }
          .nav-links a:last-child {
            border-bottom: none;
          }
        }
        
        /* =========================================
           🔴 MOBILE FIX FOR LONG NAMES 🔴
           ========================================= */
        @media (max-width: 768px) {
          .logo h1 { 
            font-size: 1.35rem; /* Logo ko thoda chota kiya taaki naam ki jagah mile */ 
          }
          .nav-right { gap: 10px; }
          .user-btn { 
            max-width: 160px; /* Pehle 110px tha, ab bada kar diya hai */
          }
        }

        /* Extra small devices (like iPhone SE) */
        @media (max-width: 380px) {
          .logo h1 { font-size: 1.2rem; }
          .nav-right { gap: 8px; }
          .user-btn { 
            max-width: 130px; /* Pehle 80px tha, ab ise bhi bada kar diya hai */
          }
        }
      `}</style>

      <header className="header">
        <div className="logo">
          <h1>Neelkanth</h1>
        </div>

        {/* Hamburger Menu Button (Mobile & Tablet) */}
        <div className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✖' : '☰'}
        </div>

        {/* Navigation Links */}
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={closeMenu} className={location.pathname === '/' && location.hash === '' ? 'active' : ''}>
            Home
          </Link>
          <Link to="/products" onClick={closeMenu} className={location.pathname === '/products' ? 'active' : ''}>
            Products
          </Link>
          <Link to="/#categories" onClick={closeMenu} className={location.hash === '#categories' ? 'active' : ''}>
            Categories
          </Link>
          <Link to="/contact" onClick={closeMenu} className={location.pathname === '/contact' ? 'active' : ''}>
            Contact Us
          </Link>
        </nav>

        <div className="nav-right">
          <div className="contact-number">
            <span>📞 +91 98765 43210</span>
          </div>

          {/* Cart */}
          <Link to="/cart" className="cart-container" onClick={closeMenu}>
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
          
          {/* User / Login */}
          <div>
            {userName ? (
              <div className="user">
                <button
                  className="user-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  title={userName}
                >
                  👤 <span>{userName}</span>
                </button>
                <div className={`dropdown${dropdownOpen ? ' open' : ''}`} onClick={() => setDropdownOpen(false)}>
                  <Link to="/profile">Profile</Link>
                  <Link to="/orders">Orders</Link>
                  <button onClick={logout}>Logout</button>
                </div>
            </div>
            ) : (
              <Link className="login-btn" to="/login" onClick={closeMenu}>
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;