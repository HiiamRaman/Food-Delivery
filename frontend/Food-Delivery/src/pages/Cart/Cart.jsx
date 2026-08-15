import React, { useContext } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { StoreContext } from "../../Context/StoreContext";
import "./Cart.css";

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

  const selectedItems = food_list.filter(
    (item) => cartItems[item._id] > 0,
  );

  const isCartEmpty = selectedItems.length === 0;

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* ================= HEADER ================= */}

        <div className="cart-header">
          <div>
            <span className="cart-eyebrow">YOUR CART</span>

            <h1>Shopping Cart</h1>

            <p>
              Review your items before continuing to checkout.
            </p>
          </div>

          <div className="cart-count">
            <ShoppingBag size={18} />

            <span>
              {selectedItems.length}{" "}
              {selectedItems.length === 1 ? "Item" : "Items"}
            </span>
          </div>
        </div>

        {isCartEmpty ? (
          /* ================= EMPTY CART ================= */

          <div className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingBag size={34} />
            </div>

            <h2>Your cart is empty</h2>

            <p>
              Add something delicious and come back here when
              you're ready to order.
            </p>

            <button
              type="button"
              onClick={() => navigate("/food-display")}
            >
              Explore food
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            {/* ================= CART ITEMS ================= */}

            <section className="cart-items-card">
              <div className="cart-items-heading">
                <h2>Your items</h2>

                <span>
                  {selectedItems.length} selected
                </span>
              </div>

              <div className="cart-items-list">
                {selectedItems.map((item) => {
                  const quantity = cartItems[item._id];
                  const itemTotal = item.price * quantity;

                  return (
                    <article
                      key={item._id}
                      className="cart-item"
                    >
                      {/* Image */}

                      <div className="cart-item-image">
                        <img
                          src={item.image}
                          alt={item.name}
                        />
                      </div>

                      {/* Info */}

                      <div className="cart-item-info">
                        <h3>{item.name}</h3>

                        <p>
                          {item.description ||
                            "Freshly prepared and ready to enjoy."}
                        </p>

                        <span className="cart-item-price">
                          Rs. {item.price}
                        </span>
                      </div>

                      {/* Quantity */}

                      <div className="cart-quantity">
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item._id)
                          }
                          aria-label={`Decrease ${item.name}`}
                        >
                          <Minus size={15} />
                        </button>

                        <span>{quantity}</span>

                        <button
                          type="button"
                          onClick={() =>
                            addToCart(item._id)
                          }
                          aria-label={`Increase ${item.name}`}
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      {/* Total */}

                      <div className="cart-item-total">
                        <span>Total</span>

                        <strong>
                          Rs. {itemTotal}
                        </strong>
                      </div>

                      {/* Remove */}

                      <button
                        type="button"
                        className="cart-remove"
                        onClick={() => {
                          for (let i = 0; i < quantity; i++) {
                            removeFromCart(item._id);
                          }
                        }}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* ================= ORDER SUMMARY ================= */}

            <aside className="cart-summary">
              <div className="cart-summary-header">
                <h2>Order summary</h2>

                <p>
                  Review your total before checkout.
                </p>
              </div>

              <div className="cart-summary-row">
                <span>Subtotal</span>

                <strong>
                  Rs. {getCartSubtotal()}
                </strong>
              </div>

              <div className="cart-summary-row">
                <span>Delivery fee</span>

                <strong>
                  Rs. {getDeliveryFee()}
                </strong>
              </div>

              <div className="cart-summary-divider" />

              <div className="cart-summary-total">
                <span>Total</span>

                <strong>
                  Rs. {getCartTotal()}
                </strong>
              </div>

              {/* Promo */}

              <div className="cart-promo">
                <label htmlFor="promoCode">
                  Have a promo code?
                </label>

                <div className="cart-promo-input">
                  <input
                    id="promoCode"
                    type="text"
                    placeholder="Enter promo code"
                  />

                  <button type="button">
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout */}

              <button
                type="button"
                className="cart-checkout-btn"
                onClick={() => navigate("/order")}
              >
                Proceed to checkout
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
