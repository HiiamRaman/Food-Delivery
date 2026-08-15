import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Check,
  CreditCard,
  Home,
  MapPin,
  PackageCheck,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] =
    useState(true);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] =
    useState(null);

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

  // ================= LOAD USER DATA =================

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user") || "{}",
    );

    const fullName =
      storedUser.fullname?.trim() || "";

    const nameParts = fullName.split(" ");

    const firstName =
      nameParts[0] || "";

    const lastName =
      nameParts.slice(1).join(" ");

    setData((prev) => ({
      ...prev,

      firstName,
      lastName,
      email: storedUser.email || "",
      phone: storedUser.phone || "",
    }));
  }, []);

  // ================= LOAD SAVED ADDRESSES =================

  useEffect(() => {
    if (!token) {
      setAddressLoading(false);
      return;
    }

    const loadAddresses = async () => {
      try {
        setAddressLoading(true);

        const response =
          await api.get("/addresses");

        const savedAddresses =
          response.data?.data?.addresses || [];

        setAddresses(savedAddresses);

        if (savedAddresses.length === 0) {
          return;
        }

        // Find user's default address
        const defaultAddress =
          savedAddresses.find(
            (address) =>
              address.isDefault,
          ) || savedAddresses[0];

        selectAddress(defaultAddress);
      } catch (error) {
        console.error(
          "LOAD ADDRESS ERROR:",
          error,
        );

        toast.error(
          error.response?.data?.data ||
            error.response?.data?.message ||
            "Unable to load saved addresses",
        );
      } finally {
        setAddressLoading(false);
      }
    };

    loadAddresses();
  }, [token]);

  // ================= SELECT ADDRESS =================

  const selectAddress = (address) => {
    if (!address) return;

    setSelectedAddressId(address._id);

    setData((prev) => ({
      ...prev,

      street: address.street || "",
      city: address.city || "",
      state: address.state || "",

      // Saved address uses "zip"
      // Checkout form uses "zipcode"
      zipcode: address.zip || "",

      country: address.country || "",
    }));
  };

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
      toast.error(
        "Cart is still loading",
      );

      return;
    }

    const hasItems = food_list.some(
      (item) =>
        cartItems[item._id] > 0,
    );

    if (!hasItems) {
      toast.error(
        "Your cart is empty",
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post("/order/create", {
          deliveryInfo: data,
        });

      const checkoutUrl =
        response.data?.data?.url ||
        response.data?.url;

      if (!checkoutUrl) {
        throw new Error(
          "Stripe checkout URL missing",
        );
      }

      window.location.assign(
        checkoutUrl,
      );
    } catch (error) {
      console.error(
        "CHECKOUT ERROR:",
        error,
      );

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

          <h1>
            Complete your order
          </h1>

          <p>
            Choose a saved address or
            enter your delivery details
            manually.
          </p>
        </div>

        <form
          onSubmit={createOrder}
          className="place-order-layout"
        >
          {/* ================= LEFT ================= */}

          <div className="checkout-left-column">
            {/* ================= SAVED ADDRESSES ================= */}

            <section className="saved-address-section">
              <div className="saved-address-header">
                <div>
                  <h2>
                    Saved addresses
                  </h2>

                  <p>
                    Choose where you want
                    this order delivered.
                  </p>
                </div>

                <button
                  type="button"
                  className="manage-address-btn"
                  onClick={() =>
                    navigate("/addresses")
                  }
                >
                  <Plus size={15} />

                  Manage
                </button>
              </div>

              {addressLoading ? (
                <div className="saved-address-loading">
                  Loading saved addresses...
                </div>
              ) : addresses.length === 0 ? (
                <div className="no-saved-address">
                  <MapPin size={19} />

                  <div>
                    <strong>
                      No saved address
                    </strong>

                    <span>
                      Enter your address
                      below or save one
                      for future orders.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/addresses")
                    }
                  >
                    Add address
                  </button>
                </div>
              ) : (
                <div className="saved-address-list">
                  {addresses.map(
                    (address) => {
                      const isSelected =
                        selectedAddressId ===
                        address._id;

                      return (
                        <button
                          key={
                            address._id
                          }
                          type="button"
                          className={`saved-address-card ${
                            isSelected
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            selectAddress(
                              address,
                            )
                          }
                        >
                          <div className="saved-address-icon">
                            {address.label ===
                            "Home" ? (
                              <Home
                                size={18}
                              />
                            ) : (
                              <MapPin
                                size={18}
                              />
                            )}
                          </div>

                          <div className="saved-address-content">
                            <div className="saved-address-title">
                              <strong>
                                {address.label ||
                                  "Address"}
                              </strong>

                              {address.isDefault && (
                                <span>
                                  Default
                                </span>
                              )}
                            </div>

                            <p>
                              {
                                address.street
                              }
                            </p>

                            <p>
                              {address.city}
                              {address.state
                                ? `, ${address.state}`
                                : ""}
                              {" · "}
                              {
                                address.zip
                              }
                            </p>
                          </div>

                          <div
                            className={`saved-address-check ${
                              isSelected
                                ? "selected"
                                : ""
                            }`}
                          >
                            {isSelected && (
                              <Check
                                size={14}
                              />
                            )}
                          </div>
                        </button>
                      );
                    },
                  )}
                </div>
              )}
            </section>

            {/* ================= DELIVERY FORM ================= */}

            <section className="delivery-card">
              <div className="section-heading">
                <div className="section-icon">
                  <MapPin size={20} />
                </div>

                <div>
                  <h2>
                    Delivery information
                  </h2>

                  <p>
                    Review or edit the
                    delivery details before
                    continuing.
                  </p>
                </div>
              </div>

              <div className="delivery-form">
                {/* Name */}

                <div className="multi-fields">
                  <div className="checkout-field">
                    <label htmlFor="firstName">
                      First name
                    </label>

                    <input
                      id="firstName"
                      required
                      name="firstName"
                      value={
                        data.firstName
                      }
                      onChange={
                        onChangeHandler
                      }
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
                      value={
                        data.lastName
                      }
                      onChange={
                        onChangeHandler
                      }
                      placeholder="Singh"
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                {/* Email */}

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
                    onChange={
                      onChangeHandler
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                {/* Street */}

                <div className="checkout-field">
                  <label htmlFor="street">
                    Street address
                  </label>

                  <input
                    id="street"
                    required
                    name="street"
                    value={data.street}
                    onChange={
                      onChangeHandler
                    }
                    placeholder="Street and house number"
                    autoComplete="street-address"
                  />
                </div>

                {/* City + state */}

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
                      onChange={
                        onChangeHandler
                      }
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
                      onChange={
                        onChangeHandler
                      }
                      placeholder="Bagmati"
                      autoComplete="address-level1"
                    />
                  </div>
                </div>

                {/* ZIP + country */}

                <div className="multi-fields">
                  <div className="checkout-field">
                    <label htmlFor="zipcode">
                      ZIP code
                    </label>

                    <input
                      id="zipcode"
                      required
                      name="zipcode"
                      value={
                        data.zipcode
                      }
                      onChange={
                        onChangeHandler
                      }
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
                      value={
                        data.country
                      }
                      onChange={
                        onChangeHandler
                      }
                      placeholder="Nepal"
                      autoComplete="country-name"
                    />
                  </div>
                </div>

                {/* Phone */}

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
                    onChange={
                      onChangeHandler
                    }
                    placeholder="+977 98XXXXXXXX"
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Saved address indicator */}

              {selectedAddressId && (
                <div className="selected-address-note">
                  <Check size={16} />

                  Using your saved
                  delivery address. You
                  can still edit any field
                  above for this order.
                </div>
              )}

              <div className="delivery-note">
                <Truck size={18} />

                <p>
                  Your delivery details
                  are used only to complete
                  this order.
                </p>
              </div>
            </section>
          </div>

          {/* ================= RIGHT ================= */}

          <aside className="checkout-summary">
            <div className="summary-heading">
              <div>
                <h2>
                  Order summary
                </h2>

                <p>
                  Review your payment
                  details.
                </p>
              </div>

              <PackageCheck size={22} />
            </div>

            <div className="summary-row">
              <span>Subtotal</span>

              <strong>
                Rs.{" "}
                {getCartSubtotal()}
              </strong>
            </div>

            <div className="summary-row">
              <span>
                Delivery fee
              </span>

              <strong>
                Rs.{" "}
                {getDeliveryFee()}
              </strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>

              <strong>
                Rs.{" "}
                {getCartTotal()}
              </strong>
            </div>

            <div className="payment-note">
              <CreditCard size={18} />

              <div>
                <strong>
                  Secure payment
                </strong>

                <span>
                  You will continue to
                  Stripe to complete
                  payment.
                </span>
              </div>
            </div>

            <div className="security-note">
              <ShieldCheck size={17} />

              <span>
                Your payment information
                is handled securely.
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
