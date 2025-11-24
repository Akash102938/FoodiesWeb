import React, { useEffect, useState } from "react";
import { useCart } from "../../CartContext/CartContext";
import fallbackImage from "../../assets/AboutImage.png";
import axios from "axios";

import { FaPlus, FaMinus } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import "./OurMenu.css";

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Mexican",
  "Italian",
  "Desserts",
  "Drinks",
];

function OurMenu() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();
  const [menuData, setMenuData] = useState({});

  // ===========================
  // LOAD MENU ITEMS
  // ===========================
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/items");

        const byCategory = res.data.reduce((acc, item) => {
          const cat = item.category || "Uncategorized";
          acc[cat] = acc[cat] || [];
          acc[cat].push(item);
          return acc;
        }, {});

        setMenuData(byCategory);
      } catch (error) {
        console.error("Failed to load menu items:", error);
      }
    };

    fetchMenu();
  }, []);

  // ===========================
  // CART HELPERS
  // ===========================
  const getCartEntry = (id) => cartItems.find((ci) => ci.item._id === id);
  const getQuantity = (id) => getCartEntry(id)?.quantity || 0;

  const displayItems = (menuData[activeCategory] ?? []).slice(0, 12);

  // ===========================
  // HANDLE ADD TO CART WITH LOGIN CHECK
  // ===========================
  const handleAddToCart = (item) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Please login to add items to cart");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      return;
    }

    addToCart(item, 1);
    toast.success("Added to cart!");
  };

  return (
    <div className="bg-gradient-to-br from-[#1a120b] to-[#3a2b1d] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200">
          <span className="font-dancingscript block text-5xl md:text-7xl sm:text-6xl mb-2">
            Our Exquisite Menu
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl font-cinzel mt-4 text-amber-100/80">
            A Symphony of Flavours
          </span>
        </h2>

        {/* CATEGORY BUTTONS */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-6 py-2 rounded-full border-2 transition-all duration-300 transform font-cinzel text-sm sm:text-lg tracking-widest
                ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-amber-900/80 to-amber-700/80 border-amber-800 scale-105 shadow-xl shadow-amber-900/30"
                    : "bg-amber-900/20 border-amber-800/30 text-amber-100/80 hover:bg-amber-800/40 hover:scale-95"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MENU ITEMS */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
          {displayItems.map((item) => {
            const cartEntry = getCartEntry(item._id);
            const quantity = getQuantity(item._id);

            return (
              <div
                key={item._id}
                className="relative bg-amber-900/20 rounded-2xl overflow-hidden border border-amber-800/30 backdrop-blur-sm flex flex-col transition-all duration-500"
              >
                <div className="relative h-48 sm:h-56 md:h-60 flex items-center justify-center bg-black/10">
                  <img
                    src={item.image || item.imageUrl || fallbackImage}
                    alt={item.name}
                    onError={(e) => (e.currentTarget.src = fallbackImage)}
                    className="max-h-full max-w-full object-contain transition-all duration-75"
                  />
                </div>

                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl mb-2 font-dancingscript text-amber-100">
                    {item.name}
                  </h3>

                  <p className="text-amber-100/80 text-xs sm:text-sm mb-4 font-cinzel leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto mb-3">
                    <span className="text-xl font-bold text-amber-300 font-dancingscript">
                      ₹{Number(item.price).toFixed(2)}
                    </span>
                  </div>

                  {/* ADD / REMOVE BUTTONS */}
                  <div className="flex items-center gap-2">
                    {quantity > 0 ? (
                      <>
                        {/* MINUS BUTTON */}
                        <button
                          className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition-colors"
                          onClick={() =>
                            quantity > 1
                              ? updateQuantity(cartEntry._id, quantity - 1)
                              : removeFromCart(cartEntry._id)
                          }
                        >
                          <FaMinus className="text-amber-100" />
                        </button>

                        <span className="w-8 text-center text-amber-100">
                          {quantity}
                        </span>

                        {/* PLUS BUTTON */}
                        <button
                          className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition-colors"
                          onClick={() =>
                            updateQuantity(cartEntry._id, quantity + 1)
                          }
                        >
                          <FaPlus className="text-amber-100" />
                        </button>
                      </>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleAddToCart(item)}
                        className="relative overflow-hidden bg-amber-900/40 px-4 py-1.5 rounded-full font-cinzel text-xs uppercase sm:text-sm tracking-wider border border-amber-800/40 transition-all duration-300"
                      >
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: "-150%" }}
                          whileHover={{ x: "150%" }}
                          transition={{ duration: 1 }}
                        />
                        <span className="relative z-10 text-black">Add to Cart</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default OurMenu;
