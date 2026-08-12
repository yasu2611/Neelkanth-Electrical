import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FiArrowLeft, FiShoppingCart } from "react-icons/fi";
import { addToCart as addProductToCart } from "../utils/cart";
import "./ProductDetail.css";
const API_URL = import.meta.env.VITE_API_BASE;
 
function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
 
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
 
  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(
            `${API_URL}/products/${id}`,
          );
          if (response.ok) {
            const data = await response.json();
            setProduct(data);
          } else {
            console.error("Product not found");
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, product]);
 
  const addToCart = async () => {
    if (!product) return;
 
    try {
      await addProductToCart(product);
      window.dispatchEvent(new Event("storage"));
      toast.success(`${product.name} added to cart!`, {
        position: "bottom-center",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      toast.error("Could not add product to cart. Please try again.", {
        position: "bottom-center",
        duration: 3000,
      });
    }
  };
 
  if (loading) {
    return <div className="nk-loading">Loading product details...</div>;
  }
 
  if (!product) {
    return (
      <div className="nk-empty">
        <p>Product not found!</p>
        <button onClick={() => navigate(-1)} className="nk-detail-back-btn">
          Go Back
        </button>
      </div>
    );
  }
 
  return (
    <div className="nk-detail-page">
      <Toaster />
      <div className="nk-detail-container">
        <button onClick={() => navigate(-1)} className="nk-detail-back-btn">
          <FiArrowLeft size={18} /> <span>Back to Products</span>
        </button>
 
        <div className="nk-detail-wrapper">
          <div className="nk-detail-img-box">
            <img
              src={
                product.image ||
                "https://via.placeholder.com/400x400?text=No+Image"
              }
              alt={product.name}
              className="nk-detail-img"
            />
          </div>
 
          <div className="nk-detail-info">
            <span className="nk-detail-category">{product.category}</span>
            <h1 className="nk-detail-title">{product.name}</h1>
            <p className="nk-detail-price">
              ₹{product.price?.toLocaleString("en-IN")}
            </p>
 
            <p className="nk-detail-description">
              {product.description ||
                "Experience the best quality with our carefully curated products. This item offers exceptional performance and durability designed just for you."}
            </p>
 
            <button onClick={addToCart} className="nk-detail-main-add-btn">
              <FiShoppingCart size={18} /> Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default ProductDetail;
 
 