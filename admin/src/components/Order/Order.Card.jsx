import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import adminApi from "../../Api/axios.admin";
import "./Order.Card.css";

export default function OrderCard({
  order,
  onWorkflow,
  onDispatch,
  updating,
}) {
  const navigate = useNavigate();

  const [currentStatus, setCurrentStatus] = useState(
    order.orderStatus
  );

  const [cancelling, setCancelling] = useState(false);

  const isUpdating = updating === true || cancelling;

  const canCancel = [
    "placed",
    "confirmed",
    "preparing",
  ].includes(currentStatus);

  const handleCancel = async () => {
    try {
      setCancelling(true);

      const response = await adminApi.patch(
        `/order/${order._id}/cancel`
      );

      setCurrentStatus(response.data.data.orderStatus);

      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error(
        "CANCEL ORDER ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div>
          <p className="order-label">Order ID</p>

          <h4>
            #{order._id?.slice(-8)}
          </h4>
        </div>

        <span
          className={`status-badge status-${currentStatus}`}
        >
          {currentStatus}
        </span>
      </div>

      <div className="customer-info">
        <p>
          👤{" "}
          <b>
            {order.user?.fullname ||
              order.user?.username ||
              "Unknown"}
          </b>
        </p>

        <p>
          📧 {order.user?.email || "Unknown"}
        </p>
      </div>

      <div className="order-summary">
        <p>
          Items: <b>{order.items?.length || 0}</b>
        </p>

        <p>
          Total:{" "}
          <b>
            Rs. {order.pricing?.totalAmount || 0}
          </b>
        </p>
      </div>

      <div className="order-actions">
        <button
          onClick={() =>
            navigate(`/admin/orders/${order._id}`)
          }
          className="details-btn"
        >
          View Details →
        </button>

        {currentStatus === "placed" && (
          <button
            onClick={() =>
              onWorkflow(order._id, "confirm")
            }
            disabled={isUpdating}
            className="workflow-btn"
          >
            {isUpdating
              ? "⏳ Updating..."
              : "✓ Confirm"}
          </button>
        )}

        {currentStatus === "confirmed" && (
          <button
            onClick={() =>
              onWorkflow(order._id, "prepare")
            }
            disabled={isUpdating}
            className="workflow-btn"
          >
            {isUpdating
              ? "⏳ Updating..."
              : "🍳 Prepare"}
          </button>
        )}

        {currentStatus === "preparing" && (
          <button
            onClick={() =>
              onDispatch(order._id)
            }
            disabled={isUpdating}
            className="dispatch-btn"
          >
            {isUpdating
              ? "⏳ Dispatching..."
              : "🚚 Dispatch"}
          </button>
        )}

        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={isUpdating}
            className="cancel-btn"
          >
            {cancelling
              ? "⏳ Cancelling..."
              : "✕ Cancel"}
          </button>
        )}
      </div>
    </div>
  );
}
