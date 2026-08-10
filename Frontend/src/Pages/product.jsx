import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FiShoppingCart } from "react-icons/fi";
import { addToCart as addProductToCart } from "../utils/cart";
import "./products.css";
 
// Placeholder Image
const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'>
      <rect width='100%' height='100%' fill='#f8fafc'/>
      <text x='50%' y='50%' font-family='Segoe UI, sans-serif' font-size='14' fill='#4b5563' text-anchor='middle' dominant-baseline='middle'>No Image</text>
    </svg>`,
  );
 
function Products() {
  const navigate = useNavigate();
  const location = useLocation();
 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const initialCategory = location.state?.category || "All";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/products");
 
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchProducts();
  }, []);
 
  useEffect(() => {
    if (location.state?.category) {
      setActiveCategory(location.state.category);
    }
  }, [location.state]);
 
  const allCategories = [
    "All",
    ...new Set(products.map((item) => item.category)),
  ];
 
  const filteredProducts = products.filter((product) => {
    if (activeCategory === "All") return true;
    return product.category === activeCategory;
  });
 
  const addToCart = async (product) => {
    try {
      await addProductToCart(product);
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
 
  return (
    <div className="nk-page">
      <Toaster />
      <div className="nk-container">
        <div className="nk-header">
          <div className="nk-header-text">
            <h1 className="nk-main-title">Latest Collection</h1>
            <p className="nk-subtitle">
              Discover our carefully curated appliances.
            </p>
          </div>
 
          <button onClick={() => navigate("/cart")} className="nk-cart-btn">
            <span>Cart</span>
            <FiShoppingCart className="nk-icon" />
          </button>
        </div>
 
        <div className="nk-category-nav scrollbar-hide">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                navigate(".", { replace: true, state: {} });
              }}
              className={`nk-category-btn ${
                activeCategory === category ? "active" : ""
              }`}
            >
              {category}
            </button>
          ))}
        </div>
 
        {loading ? (
          <div className="nk-loading">Loading collection...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="nk-empty">
            <p>No products available in this category.</p>
          </div>
        ) : (
          <div className="nk-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="nk-card">
                {/* Image Section - Clickable */}
                <div
                  className="nk-img-box"
                  onClick={() =>
                    navigate(`/product/${product._id}`, { state: { product } })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={product.image || PLACEHOLDER_IMG}
                    alt={product.name}
                    className="nk-img"
                  />
                </div>
 
                <div className="nk-details">
                  {/* Title and Price Section - Clickable */}
                  <div
                    className="nk-title-row"
                    onClick={() =>
                      navigate(`/product/${product._id}`, {
                        state: { product },
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <h3 className="nk-product-title">{product.name}</h3>
                    <span className="nk-price">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </span>
                  </div>
 
                  <p className="nk-category-text">{product.category}</p>
 
                  <button
                    onClick={() => addToCart(product)}
                    className="nk-add-btn"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
 
export default Products;
 
 