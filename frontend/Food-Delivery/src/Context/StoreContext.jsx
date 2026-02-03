import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:3000";
  const [category, setCategory] = useState("All"); // default "All"
  const [token, setToken] = useState("");
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/v1/allfoods");
    setFoodList(response.data.data.foods);
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
      const response = await axios.get(`${url}/api/v1/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  // const addToCart = async (foodId) => {
  //   // 1. Update frontend optimistically
  //   setCartItems((prev) => ({
  //     ...prev,
  //     [foodId]: prev[foodId] ? prev[foodId] + 1 : 1,
  //   }));

  //   // 2. Persist to backend
  //   if (token) {
  //     try {
  //       const res = await axios.post(
  //         url + "/api/v1/cart/add",
  //         { foodId, quantity: 1 }, // Backend expects these keys
  //         {
  //           headers: { Authorization: `Bearer ${token}` }, // Correct header
  //         },
  //       );

  //       // 3. Sync frontend state with backend response
  //       const updatedCart = res.data.data.cart.item;
  //       const newCart = {};
  //       updatedCart.forEach((item) => {
  //         newCart[item.food._id] = item.quantity;
  //       });
  //       setCartItems(newCart);
  //     } catch (err) {
  //       console.error(
  //         "Failed to add to cart:",
  //         err.response?.data || err.message,
  //       );
  //     }
  //   }
  // };


  const addToCart = async (foodId) => {
  // Optimistic update
  setCartItems((prev) => ({
    ...prev,
    [foodId]: prev[foodId] ? prev[foodId] + 1 : 1,
  }));

  if (!token) return;

  try {
    const res = await axios.post(
      url + "/api/v1/cart/add",
      { foodId, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
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
    console.error("Failed to add to cart:", err.response?.data || err.message);
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
        await axios.delete(`${url}/api/v1/cart/remove/${foodId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
      if (localStorage.getItem("accessToken")) {
        setToken(localStorage.getItem("accessToken"));
        await loadCartData(localStorage.getItem("accessToken"));
      }
    }
    loadData();
  }, []);
  // useEffect(() => {
  //   async function loadData() {
  //     try {
  //       await fetchFoodList();

  //       const storedToken = localStorage.getItem("accessToken");
  //       if (storedToken) {
  //         setToken(storedToken);
  //         await loadCartData(storedToken); // use the same token
  //       }
  //     } catch (err) {
  //       console.error("Error loading data:", err.response?.data || err.message);
  //     }
  //   }

  //   loadData();
  // }, []);

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
