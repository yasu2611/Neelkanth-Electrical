import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <style>{`
        .footer {
          background-color: #1f2937;
          color: #ffffff;
          padding-top: 5rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 3rem;
          padding: 0 5% 3rem 5%;
          max-width: 1300px;
          margin: 0 auto;
        }
        .footer-col h4 {
          margin-bottom: 1.5rem;
          color: #ffffff;
          font-size: 1.2rem;
        }
        .footer-col p,
        .footer-col ul li {
          color: #9ca3af;
          margin-bottom: 0.8rem;
          font-size: 0.95rem;
          list-style: none;
        }
        .footer-col ul {
          padding: 0;
        }
        .footer-col ul li a {
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.3s;
        }
        .footer-col ul li a:hover {
          color: #ffffff;
        }
        .footer-bottom {
          background-color: #111827;
          color: #9ca3af;
          text-align: center;
          padding: 1.5rem;
          font-size: 0.9rem;
        }
        
        /* 🔴 Follow Us Column & Icons - HAR DEVICE KE LIYE CENTER AUR ROW */
        .follow-col {
          text-align: center; 
        }
        .social-links {
          display: flex;
          flex-direction: row; /* Hamesha ek line me rahenge */
          justify-content: center; /* Hamesha center me rahenge */
          gap: 20px;
          margin-top: 15px;
        }
        .social-links a {
          transition: transform 0.2s;
        }
        .social-links a:hover {
          transform: scale(1.1);
        }

        /* =========================================
           MOBILE FOOTER LAYOUT
           ========================================= */
        @media (max-width: 768px) {
          .footer-grid {
            display: grid;
            grid-template-columns: 1fr 1fr; /* Grid ko 2 hisso me baanta */
            gap: 2rem;
            text-align: center; /* Sab kuch center karega */
          }

          /* 1st Line: Contact Us ko full width (100%) kiya */
          .contact-col {
            grid-column: span 2;
          }

          /* 2nd Line: Quick Links & Categories (baaju-baaju mein) */
          .links-col, 
          .category-col {
            grid-column: span 1;
          }

          /* 3rd Line: Follow Us ko full width kiya */
          .follow-col {
            grid-column: span 2;
          }
        }

        /* Tablet (iPad) Adjustments */
        @media (max-width: 1024px) and (min-width: 769px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            text-align: center;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-grid">
          
          {/* Contact Us Column */}
          <div className="footer-col contact-col">
            <h4>Contact Us</h4>
            <p>📍 123, Main Road, Jamnagar, Gujarat - 361001</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ neelkanth@gmail.com</p>
          </div>
          
          {/* Quick Links Column */}
          <div className="footer-col links-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/#categories">Categories</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          {/* Categories Column */}
          <div className="footer-col category-col">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/products" state={{ category: 'Blender' }}>Blender</Link></li>
              <li><Link to="/products" state={{ category: 'Mixer Grinder' }}>Mixer Grinder</Link></li>
              <li><Link to="/products" state={{ category: 'Fan' }}>Fan</Link></li>
              <li><Link to="/products" state={{ category: 'Iron' }}>Iron</Link></li>
            </ul>
          </div>
          
          {/* Follow Us Column */}
          <div className="footer-col follow-col">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={24} color="#1877F2" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={24} color="#E4405F" />
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp size={24} color="#25D366" />
              </a>
            </div>
          </div>
          
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 Neelkanth. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;