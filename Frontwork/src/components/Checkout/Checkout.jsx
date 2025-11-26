import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../CartContext/CartContext";
import axios from "axios";

const API_BASE = "https://foodiesweb-1.onrender.com/api";

function Checkout() {
  const { totalAmount, cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // 🔹 Handle payment redirect from gateway
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get("payment_status");
    const sessionId = params.get("session_id");

    if (!paymentStatus) return;
    setLoading(true);

    if ((paymentStatus === "true" || paymentStatus === "success") && sessionId) {
      axios
        .get(`${API_BASE}/orders/confirm`, {
          params: { session_id: sessionId },
          headers: authHeaders,
        })
        .then((res) => {
          clearCart();
          navigate("/myorders", { state: { order: res.data.order || res.data } });
        })
        .catch(() => setError("Payment confirmation failed."))
        .finally(() => setLoading(false));
    }

    if (paymentStatus === "cancel" || paymentStatus === "false") {
      setError("Payment was cancelled. Please try again.");
      setLoading(false);
    }
  }, [location.search, clearCart, navigate, authHeaders]);

  // 🔹 Handle form input changes
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🔹 Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const subtotal = Number(totalAmount);
      const tax = Number((subtotal * 0.05).toFixed(2));

      const payload = {
        ...formData,
        subtotal,
        tax,
        total: subtotal + tax,
        items: cartItems.map(({ item, quantity }) => ({
          name: item.name,
          price: item.price,
          quantity,
          imageUrl: item.imageUrl || "",
        })),
      };

      const { data } = await axios.post(`${API_BASE}/orders`, payload, { headers: authHeaders });

      // Online payment redirect
      if (formData.paymentMethod === "online") {
        const checkoutUrl = data.checkoutUrl || data.url || data.checkout_url;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }
        throw new Error("Checkout URL not provided.");
      }

      if (formData.paymentMethod === "cod") {
        clearCart();
        navigate("/myorders");
        return;
      }

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] text-white py-16 px-4">
      <div className="mx-auto max-w-4xl">
        <Link to="/cart" className="flex items-center gap-2 text-amber-400 mb-4">
          <FaArrowLeft /> Back to Cart
        </Link>

        <h1 className="text-4xl font-bold text-center mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-12">
          {/* LEFT: Personal Info */}
          <div className="bg-[#4b3b3b]/80 p-6 rounded-3xl space-y-6">
            <h2 className="text-2xl font-bold">Personal Information</h2>
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} />
            <Input label="City" name="city" value={formData.city} onChange={handleInputChange} />
            <Input label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleInputChange} />
          </div>

          {/* RIGHT: Payment & Summary */}
          <div className="bg-[#4b3b3b]/80 p-6 rounded-3xl space-y-6">
            <h2 className="text-2xl font-bold">Payment Details</h2>

            <h3 className="text-lg font-semibold text-amber-100">Your Items</h3>
            <div className="space-y-4">
              {cartItems.map(({ item, quantity }) => (
                <div key={item._id} className="flex justify-between bg-[#3a2b2b] p-3 rounded-lg">
                  <div>{item.name} <span className="ml-2 text-amber-300 text-sm">x{quantity}</span></div>
                  <span>₹{(item.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <PaymentSummary totalAmount={totalAmount} />

            <div>
              <label className="block mb-2">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                className="w-full bg-[#3a2b2b] rounded-xl px-4 py-3"
              >
                <option value="">Select Method</option>
                <option value="cod">Cash on Delivery</option>
                <option value="online">Online Payment</option>
              </select>
            </div>

            {error && <p className="text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-amber-600 py-4 rounded-xl font-bold flex justify-center items-center"
            >
              <FaLock className="mr-2" />
              {loading ? "Processing..." : "Complete Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 🔹 Input component
const Input = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      required
      onChange={onChange}
      className="w-full bg-[#3a2b2b]/50 rounded-xl px-4 py-2"
    />
  </div>
);

// 🔹 Payment summary
const PaymentSummary = ({ totalAmount }) => {
  const subtotal = Number(totalAmount);
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = subtotal + tax;

  return (
    <div className="space-y-2">
      <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
      <div className="flex justify-between"><span>Tax (5%):</span><span>₹{tax.toFixed(2)}</span></div>
      <div className="flex justify-between font-bold border-t pt-2"><span>Total:</span><span>₹{total.toFixed(2)}</span></div>
    </div>
  );
};

export default Checkout;
