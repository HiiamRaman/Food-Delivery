import React, { useContext, useState } from "react";
import {
  CreditCard,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { toast } from "react-toastify";

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
  } = useContext(StoreContext);

  const [loading, setLoading] = useState(false);

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

  // ================= INPUT CHANGE =================

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= CREATE ORDER =================

  const createOrder = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (!food_list?.length) {
      toast.error("Cart is still loading");
      return;
    }

    const hasItems = food_list.some(
      (item) => cartItems[item._id] > 0,
    );

    if (!hasItems) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/order/create", {
        deliveryInfo: data,
      });

      const checkoutUrl =
        response.data?.data?.url ||
        response.data?.url;

      if (!checkoutUrl) {
        throw new Error("Stripe checkout URL missing");
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      console.error("CHECKOUT ERROR:", error);

      const message =
        error.response?.data?.data ||
        error.response?.data?.message ||
        error.message ||
        "Checkout failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="place-order-page">
      <div className="place-order-container">
        {/* ================= HEADER ================= */}

        <div className="place-order-header">
          <span>CHECKOUT</span>

          <h1>Complete your order</h1>

          <p>
            Enter your delivery details and review your order before payment.
          </p>
        </div>

        <form
          onSubmit={createOrder}
          className="place-order-layout"
        >
          {/* ================= LEFT ================= */}

          <section className="delivery-card">
            <div className="section-heading">
              <div className="section-icon">
                <MapPin size={20} />
              </div>

              <div>
                <h2>Delivery information</h2>

                <p>
                  Tell us where your order should be delivered.
                </p>
              </div>
            </div>

            <div className="delivery-form">
              <div className="multi-fields">
                <div className="checkout-field">
                  <label htmlFor="firstName">
                    First name
                  </label>

                  <input
                    id="firstName"
                    required
                    name="firstName"
                    value={data.firstName}
                    onChange={onChangeHandler}
                    placeholder="Raman"
                    autoComplete="given-name"
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="lastName">
                    Last name
                  </label>

                  <input
                    id="lastName"
                    required
                    name="lastName"
                    value={data.lastName}
                    onChange={onChangeHandler}
                    placeholder="Singh"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="checkout-field">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  required
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={onChangeHandler}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="street">
                  Street address
                </label>

                <input
                  id="street"
                  required
                  name="street"
                  value={data.street}
                  onChange={onChangeHandler}
                  placeholder="Street and house number"
                  autoComplete="street-address"
                />
              </div>

              <div className="multi-fields">
                <div className="checkout-field">
                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    required
                    name="city"
                    value={data.city}
                    onChange={onChangeHandler}
                    placeholder="Kathmandu"
                    autoComplete="address-level2"
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="state">
                    State
                  </label>

                  <input
                    id="state"
                    required
                    name="state"
                    value={data.state}
                    onChange={onChangeHandler}
                    placeholder="Bagmati"
                    autoComplete="address-level1"
                  />
                </div>
              </div>

              <div className="multi-fields">
                <div className="checkout-field">
                  <label htmlFor="zipcode">
                    ZIP code
                  </label>

                  <input
                    id="zipcode"
                    required
                    name="zipcode"
                    value={data.zipcode}
                    onChange={onChangeHandler}
                    placeholder="44600"
                    autoComplete="postal-code"
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="country">
                    Country
                  </label>

                  <input
                    id="country"
                    required
                    name="country"
                    value={data.country}
                    onChange={onChangeHandler}
                    placeholder="Nepal"
                    autoComplete="country-name"
                  />
                </div>
              </div>

              <div className="checkout-field">
                <label htmlFor="phone">
                  Phone
                </label>

                <input
                  id="phone"
                  required
                  type="tel"
                  name="phone"
                  value={data.phone}
                  onChange={onChangeHandler}
                  placeholder="+977 98XXXXXXXX"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="delivery-note">
              <Truck size={18} />

              <p>
                Your delivery details are used only to complete this order.
              </p>
            </div>
          </section>

          {/* ================= RIGHT ================= */}

          <aside className="checkout-summary">
            <div className="summary-heading">
              <div>
                <h2>Order summary</h2>

                <p>
                  Review your payment details.
                </p>
              </div>

              <PackageCheck size={22} />
            </div>

            <div className="summary-row">
              <span>Subtotal</span>

              <strong>
                Rs. {getCartSubtotal()}
              </strong>
            </div>

            <div className="summary-row">
              <span>Delivery fee</span>

              <strong>
                Rs. {getDeliveryFee()}
              </strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>

              <strong>
                Rs. {getCartTotal()}
              </strong>
            </div>

            <div className="payment-note">
              <CreditCard size={18} />

              <div>
                <strong>Secure payment</strong>

                <span>
                  You will continue to Stripe to complete payment.
                </span>
              </div>
            </div>

            <div className="security-note">
              <ShieldCheck size={17} />

              <span>
                Your payment information is handled securely.
              </span>
            </div>

            <button
              type="submit"
              className="payment-button"
              disabled={loading}
            >
              {loading
                ? "Preparing checkout..."
                : "Proceed to payment"}
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default PlaceOrder;
