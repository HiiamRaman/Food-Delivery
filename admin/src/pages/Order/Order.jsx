

import React, { useEffect, useState } from "react";
import {
  getAllOrders,
  adminDispatch,
  updateWorkflow,
} from "../../Api/order.api";
import OrderCard from "../../components/Order/Order.Card";
import { toast } from "react-toastify";
import "./Order.css";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);

  // Loading orders
  const [loading, setLoading] = useState(false);

  // Track which order is being updated
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const data = await getAllOrders();

      const orderList = data?.orders || data || [];

      setOrders(orderList);
    } catch (error) {
      console.error("❌ Admin Error (fetchOrders):", error);

      console.error("RESPONSE:", error.response?.data);

      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // WORKFLOW
  // =====================================================

  const handleWorkflow = async (orderId, action) => {
    try {
      setUpdatingOrderId(orderId);

      await updateWorkflow(orderId, action);

      toast.success("Order workflow updated successfully");

      // Refresh orders
      await fetchOrders();
    } catch (error) {
      console.error("❌ Workflow Error:", error);

      toast.error(error.response?.data?.message || "Failed to update order");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // =====================================================
  // DISPATCH
  // =====================================================

  const handleDispatch = async (orderId) => {
    try {
      setUpdatingOrderId(orderId);

      await adminDispatch(orderId);

      toast.success("Order dispatched successfully");

      // Refresh orders
      await fetchOrders();
    } catch (error) {
      console.error("❌ Dispatch Error:", error);

      toast.error(error.response?.data?.message || "Failed to dispatch order");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="orders-container">
      {/* ===============================================
          HEADER
      =============================================== */}

      <header className="page-header">
        <div className="header-info">
          <h2 className="title">📦 Order Management</h2>

          <p className="subtitle">Manage and track your business flow</p>
        </div>

        <div className="stat-pill">
          <span className="pulse-dot"></span>
          {orders.length} Active Orders
        </div>
      </header>

      {/* ===============================================
          MAIN
      =============================================== */}

      <main className="grid-viewport">
        {/* =============================================
            LOADING
        ============================================= */}

        {loading ? (
          <div className="order-loading">
            <div className="order-spinner"></div>

            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          /* ===========================================
             EMPTY STATE
          =========================================== */

          <div className="empty-state">
            <div className="empty-icon">📁</div>

            <h3>No orders found</h3>

            <p>Once you receive orders, they will appear here.</p>
          </div>
        ) : (
          /* ===========================================
             ORDER GRID
          =========================================== */

          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order._id} className="grid-card-item">
                <OrderCard
                  order={order}
                  onWorkflow={handleWorkflow}
                  onDispatch={handleDispatch}
                  updating={updatingOrderId === order._id}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
