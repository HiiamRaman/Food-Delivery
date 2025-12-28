import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets.js";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [category, setCategory] = useState("All"); // default "All"

  const [cartItems, setCartItems] = useState({});
  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  // Calculate subtotal
  const getCartSubtotal = () => {
    return food_list.reduce((sum, item) => {
      const qty = cartItems[item._id] || 0;
      return sum + item.price * qty;
    }, 0);
  };

  // Optional: delivery fee
  const getDeliveryFee = () => {
    const subtotal = getCartSubtotal();
    return subtotal > 0 ? 2 : 0; // flat fee example
  };

  // Grand total
  const getCartTotal = () => getCartSubtotal() + getDeliveryFee();

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    category,
    setCategory,
    getCartTotal,
    getDeliveryFee,
    getCartSubtotal,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
