import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../utils/axios.client";
import "./MyOrders.css";

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/order/my-orders");

      const fetchedOrders = response.data?.data?.orders || [];
      const fetchedTotalOrders =
        response.data?.data?.totalOrders || 0;

      setOrders(fetchedOrders);
      setTotalOrders(fetchedTotalOrders);
    } catch (error) {
      console.error("LOAD ORDERS ERROR:", error);

      toast.error(
        error.response?.data?.data ||
          error.response?.data?.message ||
          "Unable to load your orders",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatStatus = (status) => {
    if (!status) return "Placed";

    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase(),
      );
  };

  const formatPaymentStatus = (status) => {
    if (!status) return "Pending";

    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase(),
      );
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-loading">
            Loading your orders...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* ================= HEADER ================= */}

        <div className="orders-header">
          <div>
            <span className="orders-eyebrow">
              YOUR ORDERS
            </span>

            <h1>My Orders</h1>

            <p>
              Track your current orders and review your
              previous purchases.
            </p>
          </div>

          <div className="orders-count">
            <ShoppingBag size={18} />

            <span>
              {totalOrders}{" "}
              {totalOrders === 1
                ? "Order"
                : "Orders"}
            </span>
          </div>
        </div>

        {/* ================= EMPTY STATE ================= */}

        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">
              <Package size={34} />
            </div>

            <h2>No orders yet</h2>

            <p>
              Once you place an order, you’ll be able
              to track and review it here.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/food-display")
              }
            >
              Explore food
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article
                key={order._id}
                className="order-card"
              >
                {/* ================= TOP ================= */}

                <div className="order-card-header">
                  <div>
                    <span className="order-number">
                      Order #
                      {order._id
                        ?.slice(-6)
                        .toUpperCase()}
                    </span>

                    <div className="order-meta">
                      <span>
                        <CalendarDays size={14} />

                        {formatDate(
                          order.createdAt,
                        )}
                      </span>

                      <span>
                        <Clock3 size={14} />

                        {formatStatus(
                          order.orderStatus,
                        )}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`order-status order-status-${order.orderStatus}`}
                  >
                    {formatStatus(
                      order.orderStatus,
                    )}
                  </span>
                </div>

                {/* ================= ITEMS ================= */}

                <div className="order-items">
                  {order.items?.map(
                    (item, index) => (
                      <div
                        className="order-item"
                        key={
                          item.food || index
                        }
                      >
                        <div>
                          <strong>
                            {item.name ||
                              "Food item"}
                          </strong>

                          <span>
                            Qty:{" "}
                            {item.quantity || 1}
                          </span>
                        </div>

                        <span>
                          Rs.{" "}
                          {(item.price || 0) *
                            (item.quantity ||
                              1)}
                        </span>
                      </div>
                    ),
                  )}
                </div>

                {/* ================= ORDER INFO ================= */}

                <div className="order-info-grid">
                  <div className="order-info-item">
                    <CreditCard size={16} />

                    <div>
                      <span>Payment</span>

                      <strong>
                        {order.payment?.method ||
                          "N/A"}
                        {" · "}
                        {formatPaymentStatus(
                          order.payment
                            ?.status,
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="order-info-item">
                    <MapPin size={16} />

                    <div>
                      <span>Deliver to</span>

                      <strong>
                        {order
                          .deliveryAddress
                          ?.city || "N/A"}
                        ,{" "}
                        {order
                          .deliveryAddress
                          ?.country || ""}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* ================= PRICING ================= */}

                <div className="order-pricing">
                  <div>
                    <span>Subtotal</span>

                    <strong>
                      Rs.{" "}
                      {order.pricing
                        ?.subTotal || 0}
                    </strong>
                  </div>

                  <div>
                    <span>Delivery</span>

                    <strong>
                      Rs.{" "}
                      {order.pricing
                        ?.deliveryFee || 0}
                    </strong>
                  </div>

                  <div className="order-total">
                    <span>Total</span>

                    <strong>
                      Rs.{" "}
                      {order.pricing
                        ?.totalAmount || 0}
                    </strong>
                  </div>
                </div>

                {/* ================= FOOTER ================= */}

                <div className="order-card-footer">
                  <div>
                    <span>Order status</span>

                    <strong>
                      {formatStatus(
                        order.orderStatus,
                      )}
                    </strong>
                  </div>

                  {order.orderStatus ===
                  "out_for_delivery" ? (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/tracking/${order._id}`,
                        )
                      }
                    >
                      Track order

                      <ChevronRight
                        size={17}
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="order-details-button"
                      onClick={() =>
                        navigate(
                          `/tracking/${order._id}`,
                        )
                      }
                    >
                      View details

                      <ChevronRight
                        size={17}
                      />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
