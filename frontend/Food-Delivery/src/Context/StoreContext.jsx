import { createContext, useEffect, useState } from "react";
import api from "../utils/axios.client";
export const StoreContext = createContext(null);
import React from "react";
const StoreContextProvider = (props) => {
  const url = "http://localhost:3000";
  const [category, setCategory] = useState("All"); // default "All"
  const [token, setToken] = useState("");
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const fetchFoodList = async () => {
    try {
      const response = await api.get( "/allfoods");
      
      setFoodList(response.data.data.foods);
    } catch (error) {
      console.error("Failed to fetch food list:", error);
    }
  };

  // const loadCartData = async (token) => {
  //   const response = // Correct
  //     await axios.get(`${url}/api/v1/cart`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //   setCartItems(response.data.data.cartData);
  // };

  const loadCartData = async (token) => {
    try {
      const response = await api.get(`/cart`);

      const cartData = response.data.data.items || [];

      // Transform backend cart into frontend-friendly object
      const mappedCart = {};
      cartData.forEach((item) => {
        if (item.food && item.food._id && item.quantity) {
          mappedCart[item.food._id] = item.quantity;
        }
      });

      setCartItems(mappedCart);
    } catch (err) {
      console.error(
        "Failed to load cart data:",
        err.response?.data || err.message,
      );
      setCartItems({}); // fallback to empty cart
    }
  };


  const addToCart = async (foodId) => {
    
    // Optimistic update
    setCartItems((prev) => ({
      ...prev,
      [foodId]: prev[foodId] ? prev[foodId] + 1 : 1,
    }));

    if (!token) return;

    try {
      const res = await api.post(
        "/cart/add",
        { foodId, quantity: 1 },
        
      );
      
      const updatedCart = res.data.data.cart.item || [];
      const newCart = {};

      updatedCart.forEach((item) => {
        if (item.food && item.food._id) {
          newCart[item.food._id] = item.quantity;
        } else {
          console.warn("Skipped invalid cart item (food=null):", item);
        }
      });

      setCartItems(newCart);
    } catch (err) {
      console.error(
        "Failed to add to cart:",
        err.response?.data || err.message,
      );
    }
  };

  const removeFromCart = async (foodId) => {
    if (!cartItems[foodId]) return; // Nothing to remove

    setCartItems((prev) => ({
      ...prev,
      [foodId]: prev[foodId] - 1 > 0 ? prev[foodId] - 1 : 0,
    }));

    if (token) {
      try {
        await api.delete(`/cart/remove/${foodId}`, );
      } catch (err) {
        console.error(
          "Failed to remove from cart:",
          err.response?.data || err.message,
        );
      }
    }
  };

  const getCartSubtotal = () => {
    if (!food_list || !cartItems) return 0;

    return food_list.reduce((sum, item) => {
      const qty = cartItems[item._id] || 0;
      const price = item.price || 0;
      return sum + price * qty;
    }, 0);
  };

  const getDeliveryFee = () => {
    const subtotal = getCartSubtotal();
    return subtotal > 0 ? 2 : 0; // flat fee example
  };

  const getCartTotal = () => getCartSubtotal() + getDeliveryFee();

  //when we relaod the page the loggedin user gets logout to fix this we have to do

  useEffect(() => {
  async function loadData() {
    await fetchFoodList();

    const savedToken = localStorage.getItem("accessToken");

    if (savedToken) {
      setToken(savedToken);

      // ❌ DO NOT load old cart
      setCartItems({}); // force clean cart on refresh
    }
  }

  loadData();
}, []);
  

  const contextValue = {
    food_list,
    cartItems,
    loadCartData,
    setCartItems,
    addToCart,
    removeFromCart,
    category,
    setCategory,
    getCartTotal,
    getDeliveryFee,
    getCartSubtotal,
    url,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;





















