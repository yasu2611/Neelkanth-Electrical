import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Products from './Pages/product';
import Admin from './Pages/admin';
import Contact from './Pages/Contact';
import ProductDetail from './Pages/ProductDetail';
import Cart from './Pages/Cart';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from "./Pages/Profile";
import Checkout from "./Pages/Checkout";
import ScrollToTop from "./Components/ScrollToTop";
import Orders from "./Pages/Orders";

// Wraps the public-facing pages with the site Navbar + Footer
function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin gets its own full-page layout, no site Navbar/Footer */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<Admin />} />

        {/* All public pages share the site Navbar/Footer */}
        <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
        <Route path="/products" element={<SiteLayout><Products /></SiteLayout>} />
        <Route path="/contact" element={<SiteLayout><Contact /></SiteLayout>} />
         <Route path="/product/:id" element={<SiteLayout><ProductDetail /></SiteLayout>} />
        <Route path="/cart" element={<SiteLayout><Cart /></SiteLayout>} />
        <Route path="/checkout" element={<SiteLayout><Checkout /></SiteLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;