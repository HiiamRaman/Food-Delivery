import React, { useContext, useState } from "react";
import api from "../../utils/axios.client";
import { StoreContext } from "../../Context/StoreContext";
import "./PlaceOrder.css";

function PlaceOrder() {
  const {
    getCartSubtotal,
    getCartTotal,
    getDeliveryFee,
    token,
    food_list,
    cartItems,
    url,
  } = useContext(StoreContext);

  /* ---------------- DELIVERY FORM STATE ---------------- */
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- CREATE ORDER + STRIPE ---------------- */
  const createOrder = async (e) => {
    e.preventDefault();

    /* ---- auth guard ---- */
    if (!token) {
      alert("Please login first");
      return;
    }

    /* ---- cart validation ---- */
    if (!food_list?.length) {
      alert("Cart still loading");
      return;
    }

    const hasItems = food_list.some(
      (item) => cartItems[item._id] > 0
    );

    if (!hasItems) {
      alert("Cart is empty");
      return;
    }

    try {
      const response = await api.post(
        `/order/create`,
        { deliveryInfo: data },
        
      );
      

      const checkoutUrl =
        response.data?.data?.url ||
        response.data?.url;

      if (!checkoutUrl) {
        throw new Error("Stripe URL missing");
      }

      // redirect to Stripe checkout
      window.location.assign(checkoutUrl);

    } catch (error) {
      console.error("Checkout error:", error);

      if (error.response?.status === 401) {
        alert("Session expired — login again");
      } else {
        alert(
          error.response?.data?.message ||
          "Checkout failed"
        );
      }
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <form onSubmit={createOrder} className="place-order">

      {/* LEFT — DELIVERY */}
      <div className="place-order-left">
        <p className="title">Delivery Info</p>

        <div className="multi-fields">
          <input required name="firstName" value={data.firstName} onChange={onChangeHandler} placeholder="First name" />
          <input required name="lastName" value={data.lastName} onChange={onChangeHandler} placeholder="Last name" />
        </div>

        <input required type="email" name="email" value={data.email} onChange={onChangeHandler} placeholder="Email" />
        <input required name="street" value={data.street} onChange={onChangeHandler} placeholder="Street" />

        <div className="multi-fields">
          <input required name="city" value={data.city} onChange={onChangeHandler} placeholder="City" />
          <input required name="state" value={data.state} onChange={onChangeHandler} placeholder="State" />
        </div>

        <div className="multi-fields">
          <input required name="zipcode" value={data.zipcode} onChange={onChangeHandler} placeholder="Zip code" />
          <input required name="country" value={data.country} onChange={onChangeHandler} placeholder="Country" />
        </div>

        <input required name="phone" value={data.phone} onChange={onChangeHandler} placeholder="Phone" />
      </div>

      {/* RIGHT — TOTAL */}
      <div className="place-order-right">
        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Total</h2>

            <div className="cart-total-detail">
              <p>Subtotal</p>
              <p>${getCartSubtotal()}</p>
            </div>

            <div className="cart-total-detail">
              <p>Delivery Fee</p>
              <p>${getDeliveryFee()}</p>
            </div>

            <hr />

            <div className="cart-total-detail">
              <b>Total</b>
              <b>${getCartTotal()}</b>
            </div>
          </div>

          <button type="submit">
            Proceed to Payment
          </button>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;