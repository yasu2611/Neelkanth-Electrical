import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../utils/auth";
import { getUsersList, deleteUser, getInquiries, deleteInquiry } from "../utils/api";
import { fetchOrders, viewInvoice, updateOrderStatus } from "../utils/orders";
import "./admin.css";

const PLACEHOLDER_IMG =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'>
            <rect width='100%' height='100%' fill='#f8fafc'/>
            <text x='50%' y='50%' font-family='Segoe UI, sans-serif' font-size='14' fill='#4b5563' text-anchor='middle' dominant-baseline='middle'>No Image</text>
        </svg>`
    );

function Admin() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("products");
    const [authState, setAuthState] = useState("loading");
    
    // Sidebar Toggle State for Mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const closeSidebar = () => setIsSidebarOpen(false);

    // Product states
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [users, setUsers] = useState([]);
    const [isUsersLoading, setIsUsersLoading] = useState(true);
    const [inquiries, setInquiries] = useState([]);
    const [isInquiriesLoading, setIsInquiriesLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [isOrdersLoading, setIsOrdersLoading] = useState(true);
    const [orderStatusUpdates, setOrderStatusUpdates] = useState({});
    const [statusUpdating, setStatusUpdating] = useState({});

    const [productsSort, setProductsSort] = useState("desc");
    const [productsPageSize, setProductsPageSize] = useState("10");
    const [productsPage, setProductsPage] = useState(1);

    const [ordersSort, setOrdersSort] = useState("desc");
    const [ordersPageSize, setOrdersPageSize] = useState("10");
    const [ordersPage, setOrdersPage] = useState(1);

    const [usersSort, setUsersSort] = useState("desc");
    const [usersPageSize, setUsersPageSize] = useState("10");
    const [usersPage, setUsersPage] = useState(1);

    const [inquiriesSort, setInquiriesSort] = useState("desc");
    const [inquiriesPageSize, setInquiriesPageSize] = useState("10");
    const [inquiriesPage, setInquiriesPage] = useState(1);

    const [newProduct, setNewProduct] = useState({
        name: "",
        category: "Blender",
        price: "",
        description: "",
        image: ""
    });

    useEffect(() => {
        const currentUser = getCurrentUser();

        if (!currentUser) {
            setAuthState("guest");
            return;
        }

        if (currentUser.role !== "admin") {
            setAuthState("forbidden");
            return;
        }

        setAuthState("authorized");
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log("Error:", err);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        async function loadUsers() {
            setIsUsersLoading(true);
            try {
                const data = await getUsersList();
                setUsers(data);
            } catch (error) {
                console.error("Error loading users:", error);
                setUsers([]);
            } finally {
                setIsUsersLoading(false);
            }
        }
        loadUsers();
    }, []);

    useEffect(() => {
        async function loadInquiries() {
            setIsInquiriesLoading(true);
            try {
                const data = await getInquiries();
                setInquiries(data);
            } catch (err) {
                console.error('Error loading inquiries', err);
                setInquiries([]);
            } finally {
                setIsInquiriesLoading(false);
            }
        }
        loadInquiries();
    }, []);

    useEffect(() => {
        async function loadOrders() {
            setIsOrdersLoading(true);
            try {
                const data = await fetchOrders();
                setOrders(data);
            } catch (err) {
                console.error('Error loading orders', err);
                setOrders([]);
            } finally {
                setIsOrdersLoading(false);
            }
        }
        loadOrders();
    }, []);

    const handleLogout = () => {
        clearCurrentUser();
        navigate("/");
    };

    if (authState !== "authorized") {
        const message =
            authState === "guest"
                ? "You need to sign in before you can access the admin panel."
                : authState === "forbidden"
                    ? "You are signed in, but only admin users can access this panel."
                    : "Checking access...";

        return (
            <div className="admin-container">
                <main className="admin-main" style={{ marginLeft: 0, width: "100%", padding: "80px 40px" }}>
                    <div className="admin-card" style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
                        <h1 style={{ marginBottom: 16 }}>{authState === "guest" ? "Sign in required" : authState === "forbidden" ? "Access denied" : "Checking access"}</h1>
                        <p style={{ color: "#4b5563", lineHeight: 1.7, marginBottom: 28 }}>{message}</p>
                        {authState !== "loading" && (
                            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                                <button className="btn-add" onClick={() => navigate(authState === "guest" ? "/login" : "/")}>
                                    {authState === "guest" ? "Go to Login" : "Go Home"}
                                </button>
                                {authState === "forbidden" && (
                                    <button className="btn-cancel" onClick={() => {
                                        clearCurrentUser();
                                        navigate("/login");
                                    }}>
                                        Sign in as Admin
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        );
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

const handleEditClick = (product) => {
        setEditingId(product._id);
        setFormError("");
        setNewProduct({
            name: product.name,
            category: product.category,
            price: product.price,
            description: product.description || "", // ADD THIS
            image: product.image || ""
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormError("");
        setNewProduct({ name: "", category: "Blender", price: "", description: "", image: "" }); // UPDATE THIS
        const fileInput = document.getElementById("image-upload");
        if (fileInput) fileInput.value = "";
    };

    const getDateValue = (value) => {
        const date = value ? new Date(value) : null;
        return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
    };

    const sortByCreatedAt = (items, direction) => {
        return [...items].sort((a, b) => {
            const diff = getDateValue(b.createdAt) - getDateValue(a.createdAt);
            return direction === "desc" ? diff : -diff;
        });
    };

    const pageSizeFromState = (pageSizeState, itemCount) => {
        return pageSizeState === "all" ? itemCount : Number(pageSizeState);
    };

    const ORDER_STATUS_OPTIONS = [
        "Placed",
        "Pending",
        "Work In Progress",
        "Complete",
        "Processing",
        "Delivered",
        "Cancelled",
    ];

    const normalizeStatusClass = (status) =>
        String(status || "Placed").toLowerCase().replace(/\s+/g, "-");

    const handleStatusSelectChange = (orderId, status) => {
        setOrderStatusUpdates((prev) => ({ ...prev, [orderId]: status }));
    };

    const handleUpdateOrderStatus = async (orderId) => {
        const newStatus = orderStatusUpdates[orderId] || orders.find((order) => order._id === orderId)?.status;
        if (!newStatus) return;

        setStatusUpdating((prev) => ({ ...prev, [orderId]: true }));
        try {
            const updatedOrder = await updateOrderStatus(orderId, newStatus);
            setOrders((prevOrders) => prevOrders.map((order) => (order._id === orderId ? updatedOrder : order)));
            alert("Order status updated successfully.");
        } catch (error) {
            console.error("Failed to update status", error);
            alert(error.message || "Failed to update order status.");
        } finally {
            setStatusUpdating((prev) => ({ ...prev, [orderId]: false }));
        }
    };

    const validateForm = () => {
        if (!newProduct.name.trim()) {
            return "Product name is required.";
        }
        const priceNum = Number(newProduct.price);
        if (!newProduct.price || isNaN(priceNum) || priceNum <= 0) {
            return "Please enter a valid price greater than 0.";
        }
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationMessage = validateForm();
        if (validationMessage) {
            setFormError(validationMessage);
            return;
        }
        setFormError("");
        setIsSubmitting(true);

        const productData = {
            name: newProduct.name.trim(),
            category: newProduct.category,
            price: newProduct.price,
            description: newProduct.description.trim(),
            image: newProduct.image || PLACEHOLDER_IMG
        };

        try {
            if (editingId) {
                const response = await fetch(`http://localhost:5000/api/products/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(productData),
                });

                if (response.ok) {
                    const updatedProduct = await response.json();
                    setProducts(products.map(p => (p._id === editingId ? updatedProduct : p)));
                    alert("✅ Product Updated Successfully!");
                    cancelEdit();
                } else {
                    setFormError("Failed to update product. Please try again.");
                }
            } else {
                const response = await fetch("http://localhost:5000/api/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(productData),
                });

                if (response.ok) {
                    const savedProduct = await response.json();
                    setProducts([...products, savedProduct]);
                    alert("✅ Product Added to Database!");
                    cancelEdit();
                } else {
                    setFormError("Failed to add product. Please try again.");
                }
            }
        } catch (error) {
            console.error("Error saving product:", error);
            setFormError("Could not reach the server. Is the backend running?");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    setProducts(products.filter(p => p._id !== id));
                    alert("✅ Product Deleted!");
                } else {
                    alert("❌ Failed to delete product.");
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("❌ Could not reach the server.");
            }
        }
    };

    const getPagedItems = (items, sortDirection, pageSizeState, currentPage) => {
        const sorted = sortByCreatedAt(items, sortDirection);
        const pageSize = pageSizeFromState(pageSizeState, sorted.length);
        const pageCount = pageSize === 0 ? 1 : Math.max(1, Math.ceil(sorted.length / pageSize));
        const safePage = Math.min(Math.max(1, currentPage), pageCount);
        const visible = pageSizeState === "all" ? sorted : sorted.slice((safePage - 1) * pageSize, safePage * pageSize);
        return { visible, pageCount, pageSize, currentPage: safePage };
    };

    const productPageData = getPagedItems(products, productsSort, productsPageSize, productsPage);
    const orderPageData = getPagedItems(orders, ordersSort, ordersPageSize, ordersPage);
    const inquiryPageData = getPagedItems(inquiries, inquiriesSort, inquiriesPageSize, inquiriesPage);
    const visibleUsers = users.filter((user) => user.role !== "admin");
    const userPageData = getPagedItems(visibleUsers, usersSort, usersPageSize, usersPage);

    return (
        <div className="admin-container">
            {/* Background Overlay for mobile menu */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
                {/* Dhyan Dein: Desktop par ye dikhega, mobile par CSS se hide ho jayega */}
                <h2 className="desktop-logo">⚡ Neelkanth</h2>
                <div className="admin-nav">
                    <button
                        className={activeTab === "products" ? "active" : ""}
                        onClick={() => { setActiveTab("products"); closeSidebar(); }}
                    >
                        📦 Products
                    </button>
                    <button
                        className={activeTab === "orders" ? "active" : ""}
                        onClick={() => { setActiveTab("orders"); closeSidebar(); }}
                    >
                        🛒 Orders
                    </button>
                    <button
                        className={activeTab === "users" ? "active" : ""}
                        onClick={() => { setActiveTab("users"); closeSidebar(); }}
                    >
                        👥 Users
                    </button>
                    <button
                        className={activeTab === "inquiries" ? "active" : ""}
                        onClick={() => { setActiveTab("inquiries"); closeSidebar(); }}
                    >
                        📞 Inquiries
                    </button>
                </div>
                <div className="logout-section" style={{ padding: "0 20px", marginTop: "20px" }}>
                    <button className="btn-cancel" style={{ width: "100%", textAlign: "left", border: "none", background: "none", color: "#cbd5e1" }} onClick={handleLogout}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* 🔴 NAYA: Hamburger Header with Title (Mobile par hi dikhega) */}
                <div className="mobile-header">
                    <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
                        ☰
                    </button>
                    <h2 className="mobile-logo">⚡ Neelkanth</h2>
                </div>

                {activeTab === "products" && (
                    <div className="admin-section">
                        <h1>Manage Electronics</h1>

                        <div className="admin-card">
                            <h3>{editingId ? "✏️ Edit Product details" : "➕ Add New Product"}</h3>
                            <form className="admin-form" onSubmit={handleSubmit}>
                                {formError && <p className="form-error">{formError}</p>}

                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Bajaj 500W Mixer"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    >
                                        <option value="Blender">Blender</option>
                                        <option value="Mixer Grinder">Mixer Grinder</option>
                                        <option value="Fan">Fan</option>
                                        <option value="Iron">Iron</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 1500"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        min="1"
                                        required
                                    />
                                </div>

                                {/* NEW Description Field */}
                                <div className="form-group" style={{ gridColumn: "span 3" }}> 
                                    <label>Product Details / Description</label>
                                    <textarea
                                        placeholder="Enter product details..."
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                        rows="3"
                                        required
                                    />
                                </div>

                                <div className="form-group image-upload-row">
                                    <div className="file-input-wrapper">
                                        <input
                                            type="file"
                                            id="image-upload"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </div>

                                    <div className="image-preview-container">
                                        <img
                                            src={newProduct.image || PLACEHOLDER_IMG}
                                            alt="Preview"
                                            className="image-preview"
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-add" disabled={isSubmitting}>
                                        {isSubmitting
                                            ? "Saving..."
                                            : editingId
                                                ? "Update Product"
                                                : "Add Product"}
                                    </button>
                                    {editingId && (
                                        <button type="button" className="btn-cancel" onClick={cancelEdit}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="admin-card margin-top">
                            <h3>Product Inventory</h3>
                            <div className="table-toolbar">
                                <div>
                                    <label>Show</label>
                                    <select
                                        value={productsPageSize}
                                        onChange={(e) => {
                                            setProductsPageSize(e.target.value);
                                            setProductsPage(1);
                                        }}
                                    >
                                        <option value="10">Latest 10</option>
                                        <option value="25">Latest 25</option>
                                        <option value="all">All</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Sort</label>
                                    <select
                                        value={productsSort}
                                        onChange={(e) => {
                                            setProductsSort(e.target.value);
                                            setProductsPage(1);
                                        }}
                                    >
                                        <option value="desc">Newest First</option>
                                        <option value="asc">Oldest First</option>
                                    </select>
                                </div>
                            </div>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Details</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="5" className="admin-loading">
                                                Loading products...
                                            </td>
                                        </tr>
                                    ) : productPageData.visible.length > 0 ? (
                                        productPageData.visible.map(p => (
                                            <tr key={p._id}>
                                                <td>
                                                    <img
                                                        src={p.image || PLACEHOLDER_IMG}
                                                        alt={p.name}
                                                        className="table-img"
                                                    />
                                                </td>
                                                <td>{p.name}</td>
                                                <td><span className="badge">{p.category}</span></td>
                                                <td>₹{p.price}</td>
                                                <td>
                                                    <div style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {p.description || "No details added"}
                                                    </div>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => handleEditClick(p)}
                                                        title="Edit"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => handleDeleteProduct(p._id)}
                                                        title="Delete"
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="admin-empty">
                                                No products available. Add a new product above!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {productsPageSize !== "all" && productPageData.pageCount > 1 && (
                                <div className="pagination-controls">
                                    <button
                                        disabled={productPageData.currentPage === 1}
                                        onClick={() => setProductsPage(productPageData.currentPage - 1)}
                                    >
                                        Previous
                                    </button>
                                    <span>
                                        Page {productPageData.currentPage} of {productPageData.pageCount}
                                    </span>
                                    <button
                                        disabled={productPageData.currentPage === productPageData.pageCount}
                                        onClick={() => setProductsPage(productPageData.currentPage + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="admin-section">
                        <h1>Customer Orders</h1>
                        <div className="admin-card">
                            {isOrdersLoading ? (
                                <p>Loading orders...</p>
                            ) : orderPageData.visible.length === 0 ? (
                                <p>No orders found.</p>
                            ) : (
                                <>
                                    <div className="table-toolbar">
                                        <div>
                                            <label>Show</label>
                                            <select
                                                value={ordersPageSize}
                                                onChange={(e) => {
                                                    setOrdersPageSize(e.target.value);
                                                    setOrdersPage(1);
                                                }}
                                            >
                                                <option value="10">Latest 10</option>
                                                <option value="25">Latest 25</option>
                                                <option value="all">All</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label>Sort</label>
                                            <select
                                                value={ordersSort}
                                                onChange={(e) => {
                                                    setOrdersSort(e.target.value);
                                                    setOrdersPage(1);
                                                }}
                                            >
                                                <option value="desc">Newest First</option>
                                                <option value="asc">Oldest First</option>
                                            </select>
                                        </div>
                                    </div>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>User</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Placed</th>
                                                <th>Invoice</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderPageData.visible.map((order) => (
                                                <tr key={order._id}>
                                                    <td>{order._id}</td>
                                                    <td>{order.userId?.fullName || order.userId?.username || order.userId || "Unknown"}</td>
                                                    <td>₹{order.grandTotal}</td>
                                                    <td>
                                                        <div className="status-editor">
                                                            <select
                                                                value={orderStatusUpdates[order._id] ?? order.status ?? "Placed"}
                                                                disabled={statusUpdating[order._id]}
                                                                onChange={async (e) => {
                                                                    const newStatus = e.target.value;
                                                                    handleStatusSelectChange(order._id, newStatus);

                                                                    setStatusUpdating((prev) => ({ ...prev, [order._id]: true }));
                                                                    try {
                                                                        const updatedOrder = await updateOrderStatus(order._id, newStatus);
                                                                        setOrders((prevOrders) =>
                                                                            prevOrders.map((o) => (o._id === order._id ? updatedOrder : o))
                                                                        );
                                                                    } catch (error) {
                                                                        console.error("Failed to update status", error);
                                                                        alert(error.message || "Failed to update order status.");
                                                                    } finally {
                                                                        setStatusUpdating((prev) => ({ ...prev, [order._id]: false }));
                                                                    }
                                                                }}
                                                            >
                                                                {ORDER_STATUS_OPTIONS.map((status) => (
                                                                    <option key={status} value={status}>
                                                                        {status}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</td>
                                                    <td>
                                                        <button
                                                            className="btn-view"
                                                            onClick={async () => {
                                                                try {
                                                                    await viewInvoice(order._id);
                                                                } catch (downloadError) {
                                                                    alert(downloadError.message || "Failed to load invoice.");
                                                                }
                                                            }}
                                                        >
                                                            View PDF
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {ordersPageSize !== "all" && orderPageData.pageCount > 1 && (
                                        <div className="pagination-controls">
                                            <button
                                                disabled={orderPageData.currentPage === 1}
                                                onClick={() => setOrdersPage(orderPageData.currentPage - 1)}
                                            >
                                                Previous
                                            </button>
                                            <span>
                                                Page {orderPageData.currentPage} of {orderPageData.pageCount}
                                            </span>
                                            <button
                                                disabled={orderPageData.currentPage === orderPageData.pageCount}
                                                onClick={() => setOrdersPage(orderPageData.currentPage + 1)}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "users" && (
                    <div className="admin-section">
                        <h1>User Accounts</h1>
                        <div className="admin-card">
                            {isUsersLoading ? (
                                <p>Loading users...</p>
                            ) : userPageData.visible.length === 0 ? (
                                <p>No users found.</p>
                            ) : (
                                <>
                                    <div className="table-toolbar">
                                        <div>
                                            <label>Show</label>
                                            <select
                                                value={usersPageSize}
                                                onChange={(e) => {
                                                    setUsersPageSize(e.target.value);
                                                    setUsersPage(1);
                                                }}
                                            >
                                                <option value="10">Latest 10</option>
                                                <option value="25">Latest 25</option>
                                                <option value="all">All</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label>Sort</label>
                                            <select
                                                value={usersSort}
                                                onChange={(e) => {
                                                    setUsersSort(e.target.value);
                                                    setUsersPage(1);
                                                }}
                                            >
                                                <option value="desc">Newest First</option>
                                                <option value="asc">Oldest First</option>
                                            </select>
                                        </div>
                                    </div>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Last Login</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userPageData.visible.map((user) => (
                                                <tr key={user._id}>
                                                    <td>{user.fullName || user.username}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}</td>
                                                    <td>{user.active === false ? "Inactive" : user.status || "Active"}</td>
                                                    <td>
                                                        <button
                                                            className="btn-delete"
                                                            onClick={async () => {
                                                                if (window.confirm(`Delete user ${user.fullName || user.username}?`)) {
                                                                    try {
                                                                        await deleteUser(user._id);
                                                                        setUsers(users.filter((u) => u._id !== user._id));
                                                                        alert("User deleted successfully.");
                                                                    } catch (error) {
                                                                        alert(error.message || "Could not delete user.");
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {usersPageSize !== "all" && userPageData.pageCount > 1 && (
                                        <div className="pagination-controls">
                                            <button
                                                disabled={userPageData.currentPage === 1}
                                                onClick={() => setUsersPage(userPageData.currentPage - 1)}
                                            >
                                                Previous
                                            </button>
                                            <span>
                                                Page {userPageData.currentPage} of {userPageData.pageCount}
                                            </span>
                                            <button
                                                disabled={userPageData.currentPage === userPageData.pageCount}
                                                onClick={() => setUsersPage(userPageData.currentPage + 1)}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "inquiries" && (
                    <div className="admin-section">
                        <h1>Contact Inquiries</h1>
                        <div className="admin-card">
                            {isInquiriesLoading ? (
                                <p>Loading inquiries...</p>
                            ) : inquiryPageData.visible.length === 0 ? (
                                <p>No inquiries yet.</p>
                            ) : (
                                <>
                                    <div className="table-toolbar">
                                        <div>
                                            <label>Show</label>
                                            <select
                                                value={inquiriesPageSize}
                                                onChange={(e) => {
                                                    setInquiriesPageSize(e.target.value);
                                                    setInquiriesPage(1);
                                                }}
                                            >
                                                <option value="10">Latest 10</option>
                                                <option value="25">Latest 25</option>
                                                <option value="all">All</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label>Sort</label>
                                            <select
                                                value={inquiriesSort}
                                                onChange={(e) => {
                                                    setInquiriesSort(e.target.value);
                                                    setInquiriesPage(1);
                                                }}
                                            >
                                                <option value="desc">Newest First</option>
                                                <option value="asc">Oldest First</option>
                                            </select>
                                        </div>
                                    </div>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Message</th>
                                                <th>Submitted</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inquiryPageData.visible.map((iq) => (
                                                <tr key={iq._id}>
                                                    <td>{iq.name}</td>
                                                    <td>{iq.email}</td>
                                                    <td>{iq.phone}</td>
                                                    <td style={{ maxWidth: 360 }}>{iq.message}</td>
                                                    <td>{iq.createdAt ? new Date(iq.createdAt).toLocaleString() : "-"}</td>
                                                    <td>
                                                        <button
                                                            className="btn-delete"
                                                            onClick={async () => {
                                                                if (window.confirm('Delete this inquiry?')) {
                                                                    try {
                                                                        await deleteInquiry(iq._id);
                                                                        setInquiries(inquiries.filter((i) => i._id !== iq._id));
                                                                        alert('Inquiry deleted.');
                                                                    } catch (err) {
                                                                        alert(err.message || 'Could not delete inquiry.');
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {inquiriesPageSize !== "all" && inquiryPageData.pageCount > 1 && (
                                        <div className="pagination-controls">
                                            <button
                                                disabled={inquiryPageData.currentPage === 1}
                                                onClick={() => setInquiriesPage(inquiryPageData.currentPage - 1)}
                                            >
                                                Previous
                                            </button>
                                            <span>
                                                Page {inquiryPageData.currentPage} of {inquiryPageData.pageCount}
                                            </span>
                                            <button
                                                disabled={inquiryPageData.currentPage === inquiryPageData.pageCount}
                                                onClick={() => setInquiriesPage(inquiryPageData.currentPage + 1)}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Admin;