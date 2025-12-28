import React, { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
function Cart() {
  const {
    cartItems,
    removeFromCart,
    addToCart,
    food_list,
    getCartTotal,
    getDeliveryFee,
    getCartSubtotal,
  } = useContext(StoreContext);
  const navigate = useNavigate();

  const cartTotal = food_list.reduce(
    (sum, item) => sum + (cartItems[item._id] || 0) * item.price,
    0
  );

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list
          .filter((item) => cartItems[item._id] > 0)
          .map((item) => (
            <div>
              <div key={item._id} className="cart-items-selected">
                <img src={item.image} alt="" />
                <p>
                  {item.name} × {cartItems[item._id]}
                </p>
                <p>$ {item.price}</p>
                <p>{cartItems[item._id]}</p>

                <p> ${item.price * cartItems[item._id]}</p>
                <p onClick={() => removeFromCart(item._id)} className="cross">
                  X
                </p>
              </div>
              <hr />
            </div>
          ))}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div className="cart-total-detail-1">
            <p>Subtotal</p>
            <p>${getCartSubtotal()}</p>
          </div>
          <hr />
          <div className="cart-total-detail-2">
            <p>Delivery Fee</p>
            <p>${getDeliveryFee()}</p>
          </div>
          <hr />
          <div className="cart-total-detail-3">
            <b>Total</b>
            <b>${getCartTotal()}</b>
          </div>

          <div className="cart-promocode">
            <div>
              <p>if you have promocode, Enter it here </p>
              <div className="cart-promocode-input">
                <input type="text" placeholder="Enter Your Promocode Here!!" />
                <button>Submit</button>
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => navigate("/order")}>Proceed To Checkout</button>
      </div>
    </div>
  );
}

export default Cart;
