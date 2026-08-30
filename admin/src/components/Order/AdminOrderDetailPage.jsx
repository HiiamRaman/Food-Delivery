import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Invoice from "../Invoice/Invoice";
import adminApi from "../../Api/axios.admin";

import "./AdminOrderDetailPage.css";

export default function AdminOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [showInvoice, setShowInvoice] =
    useState(false);

  // =========================
  // FETCH ORDER
  // =========================

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const response = await adminApi.get(
        `/order/${orderId}`
      );

      setOrder(response.data.data);
    } catch (error) {
      console.error(
        "GET ORDER ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to fetch order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // =========================
  // WORKFLOW
  // =========================

  const handleWorkflow = async (action) => {
    try {
      setUpdating(true);

      const response = await adminApi.post(
        `/order/${orderId}/workflow`,
        {
          action,
        }
      );

      setOrder(response.data.data);

      toast.success(
        "Order updated successfully"
      );
    } catch (error) {
      console.error(
        "WORKFLOW ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update order"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // DISPATCH
  // =========================

  const handleDispatch = async () => {
    try {
      setUpdating(true);

      const response = await adminApi.post(
        `/order/${orderId}/admin-dispatch`
      );

      setOrder(response.data.data);

      toast.success(
        "Order dispatched successfully"
      );
    } catch (error) {
      console.error(
        "DISPATCH ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to dispatch order"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // CANCEL
  // =========================

  const handleCancel = async () => {
    try {
      setUpdating(true);

      const response = await adminApi.patch(
        `/order/${orderId}/cancel`
      );

      setOrder(response.data.data);

      toast.success(
        "Order cancelled successfully"
      );
    } catch (error) {
      console.error(
        "CANCEL ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to cancel order"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="order-details-loading">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-loading">
        Order not found
      </div>
    );
  }

  const canCancel = [
    "placed",
    "confirmed",
    "preparing",
  ].includes(order.orderStatus);

  return (
    <div className="admin-order-details">
      {/* BACK BUTTON */}

      <button
        onClick={() => navigate(-1)}
        className="back-btn"
      >
        ← Back to Orders
      </button>

      {/* HEADER */}

      <div className="details-header">
        <div>
          <p className="details-label">
            Order ID
          </p>

          <h1>
            #{order._id?.slice(-8)}
          </h1>
        </div>

        <div className="header-actions">
          <span
            className={`details-status status-${order.orderStatus}`}
          >
            {order.orderStatus}
          </span>

          <button
            className="show-invoice-btn"
            onClick={() =>
              setShowInvoice(
                (previous) => !previous
              )
            }
          >
            {showInvoice
              ? "Hide Invoice"
              : "View Invoice"}
          </button>
        </div>
      </div>

      {/* MAIN TWO COLUMN AREA */}

      <div
        className={`order-page-columns ${
          showInvoice
            ? "invoice-open"
            : ""
        }`}
      >
        {/* ========================= */}
        {/* LEFT COLUMN */}
        {/* ========================= */}

        <div className="order-details-column">
          {/* CUSTOMER + PAYMENT */}

          <div className="details-grid">
            <section className="details-card">
              <h2>Customer</h2>

              <p>
                <span>Name</span>

                <b>
                  {order.user?.fullname ||
                    order.user
                      ?.username ||
                    "Unknown"}
                </b>
              </p>

              <p>
                <span>Email</span>

                <b>
                  {order.user?.email ||
                    "Unknown"}
                </b>
              </p>
            </section>

            <section className="details-card">
              <h2>Payment</h2>

              <p>
                <span>Method</span>

                <b>
                  {order.payment?.method ||
                    "-"}
                </b>
              </p>

              <p>
                <span>Status</span>

                <b>
                  {order.payment?.status ||
                    "-"}
                </b>
              </p>
            </section>
          </div>

          {/* DELIVERY ADDRESS */}

          <section className="details-card">
            <h2>Delivery Address</h2>

            <div className="address-content">
              <p>
                {
                  order.deliveryAddress
                    ?.firstName
                }{" "}
                {
                  order.deliveryAddress
                    ?.lastName
                }
              </p>

              <p>
                {
                  order.deliveryAddress
                    ?.phone
                }
              </p>

              <p>
                {
                  order.deliveryAddress
                    ?.street
                }
                ,{" "}
                {
                  order.deliveryAddress
                    ?.city
                }
                ,{" "}
                {
                  order.deliveryAddress
                    ?.state
                }
                ,{" "}
                {
                  order.deliveryAddress
                    ?.country
                }
              </p>
            </div>
          </section>

          {/* ORDER ITEMS */}

          <section className="details-card">
            <h2>Order Items</h2>

            <div className="details-items">
              {order.items?.map(
                (item, index) => (
                  <div
                    key={
                      item.food ||
                      index
                    }
                    className="details-item"
                  >
                    <div>
                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        Quantity:{" "}
                        {
                          item.quantity
                        }
                      </p>
                    </div>

                    <div className="item-price">
                      Rs.{" "}
                      {item.price *
                        item.quantity}
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* PRICING */}

          <section className="details-card">
            <h2>Pricing</h2>

            <div className="pricing-row">
              <span>Subtotal</span>

              <b>
                Rs.{" "}
                {order.pricing
                  ?.subTotal || 0}
              </b>
            </div>

            <div className="pricing-row">
              <span>
                Delivery Fee
              </span>

              <b>
                Rs.{" "}
                {order.pricing
                  ?.deliveryFee ||
                  0}
              </b>
            </div>

            <div className="pricing-row pricing-total">
              <span>Total</span>

              <b>
                Rs.{" "}
                {order.pricing
                  ?.totalAmount ||
                  0}
              </b>
            </div>
          </section>

          {/* MANAGE ORDER */}

          <section className="details-card">
            <h2>Manage Order</h2>

            <div className="details-actions">
              {/* CONFIRM */}

              {order.orderStatus ===
                "placed" && (
                <button
                  onClick={() =>
                    handleWorkflow(
                      "confirm"
                    )
                  }
                  disabled={updating}
                  className="action-primary"
                >
                  ✓ Confirm Order
                </button>
              )}

              {/* PREPARE */}

              {order.orderStatus ===
                "confirmed" && (
                <button
                  onClick={() =>
                    handleWorkflow(
                      "prepare"
                    )
                  }
                  disabled={updating}
                  className="action-primary"
                >
                  🍳 Start Preparing
                </button>
              )}

              {/* DISPATCH */}

              {order.orderStatus ===
                "preparing" && (
                <button
                  onClick={
                    handleDispatch
                  }
                  disabled={updating}
                  className="action-dispatch"
                >
                  🚚 Dispatch Order
                </button>
              )}

              {/* CANCEL */}

              {canCancel && (
                <button
                  onClick={
                    handleCancel
                  }
                  disabled={updating}
                  className="action-cancel"
                >
                  ✕ Cancel Order
                </button>
              )}

              {/* OUT FOR DELIVERY */}

              {order.orderStatus ===
                "out_for_delivery" && (
                <div className="state-message">
                  🚚 Order is out for
                  delivery
                </div>
              )}

              {/* DELIVERED */}

              {order.orderStatus ===
                "delivered" && (
                <div className="state-message success">
                  ✓ Order delivered
                </div>
              )}

              {/* CANCELLED */}

              {order.orderStatus ===
                "cancelled" && (
                <div className="state-message cancelled">
                  ✕ Order cancelled
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ========================= */}
        {/* RIGHT INVOICE COLUMN */}
        {/* ========================= */}

        {showInvoice && (
          <aside className="invoice-column">
            <div className="invoice-column-header">
              <div>
                <h2>Invoice</h2>

                <p>
                  Order #
                  {order._id?.slice(
                    -8
                  )}
                </p>
              </div>

              <button
                className="print-invoice-btn"
                onClick={() =>
                  window.print()
                }
              >
                🖨 Print
              </button>
            </div>

            <Invoice order={order} />
          </aside>
        )}
      </div>
    </div>
  );
}
