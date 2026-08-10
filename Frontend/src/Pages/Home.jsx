import React, { useEffect } from 'react';
import { useNavigate , useLocation } from 'react-router-dom';
import { FaShieldAlt, FaRupeeSign, FaTools, FaHeadset } from "react-icons/fa";
import './Home.css';

const Home = () => {
  const navigate = useNavigate(); 
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
     
      const section = document.getElementById(location.hash.substring(1));
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100); 
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="home-container">
      

      
      <section className="hero-section">
        <div className="hero-content">
          <h2>Quality Electronics<br />For Better Living</h2>
          <p>Find the best range of home appliances at affordable prices.</p>
          <button className="btn-primary" onClick={() => navigate('/products')}>Shop Now</button>
        </div>
      </section>

      {/* SHOP BY CATEGORY SECTION */}
      <section id="categories" className="category-section">
  <div className="section-title">
    <h3>Shop By Category</h3>
    <div className="underline"></div>
  </div>

  <div className="category-grid">
    <div className="category-card">
      <div className="img-container">
        <img src="https://glenindia.com/cdn/shop/files/SA4049DXHandBlender200WISIBlack.jpg?v=1744106961&width=800" alt="Blender" />
      </div>
      <h4>Blender</h4>
    
      <button className="btn-outline" onClick={() => navigate('/products', { state: { category: 'Blender' } })}>View Products</button>
    </div>

    <div className="category-card">
      <div className="img-container">
        <img src="https://i.pinimg.com/1200x/c7/2a/68/c72a685e11283a81d1e2d7b955b5159f.jpg" alt="Mixer Grinder" />
      </div>
      <h4>Mixer Grinder</h4>
      <button className="btn-outline" onClick={() => navigate('/products', { state: { category: 'Mixer Grinder' } })}>View Products</button>
    </div>

    <div className="category-card">
      <div className="img-container">
        <img src="https://i.pinimg.com/736x/29/e0/b3/29e0b36c4f009f9cb7f7279deb5efcda.jpg" alt="Fan" />
      </div>
      <h4>Fan</h4>
      <button className="btn-outline" onClick={() => navigate('/products', { state: { category: 'Fan' } })}>View Products</button>
    </div>

    <div className="category-card">
      <div className="img-container">
        <img src="https://i.pinimg.com/1200x/2d/14/bd/2d14bda898fd5675a0c0a36ca0c67fd2.jpg" alt="Iron" />
      </div>
      <h4>Iron</h4>
      <button className="btn-outline" onClick={() => navigate('/products', { state: { category: 'Iron' } })}>View Products</button>
    </div>
  </div>
</section>

      {/* WHY CHOOSE US SECTION */}
     <section id="why-choose-us" className="why-choose-us-section">
        <div className="section-title text-center">
          <h3>Why Choose Us?</h3>
          <div className="underline mx-auto"></div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="icon-wrapper">
              <FaShieldAlt size={35} color="#1a56db" />
            </div>
            <h4 className="theme-heading">Premium Quality</h4>
            <p>We only sell 100% original and certified appliances for your home.</p>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper">
              <FaRupeeSign size={35} color="#1a56db" />
            </div>
            <h4 className="theme-heading">Affordable Prices</h4>
            <p>Get the best quality home appliances at the most competitive prices in the market.</p>
          </div>

         <div className="feature-card">
            <div className="icon-wrapper">
              <FaTools size={35} color="#1a56db" />
            </div>
            <h4 className="theme-heading">Expert After-Sales Service</h4>
            <p>We ensure the long-lasting performance of your products with our quick and reliable maintenance services.</p>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper">
              <FaHeadset size={35} color="#1a56db" />
            </div>
            <h4 className="theme-heading">24/7 Support</h4>
            <p>Our dedicated customer service team is always here to assist you.</p>
          </div>
        </div>
      </section>

     </div>
  );
};

export default Home;