import { useEffect, useState } from "react";

import {
  getAllOrders,
  adminDispatch,
  updateWorkflow,
} from "../../Api/order.api";
import OrderCard from "../../components/Order/Order.Card";
import "./Order.css";
import api from "../../Api/axios.admin";
export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  //Fetch Orders

  const fetchOrders = async () => {
    try {
      const res = await api.get("http://localhost:3000/api/v1/order/allorders");
     
      const data = Array.isArray(res.data) ? res.data : res.data.orders || [];
      setOrders(data);
    } catch (error) {
      console.log("Admin Error", error);
    }
  };

  //WorkFlow
  const handleWorkflow = async (orderId, action) => {
    try {
      await api.post(`http://localhost:3000/api/v1/order/${orderId}/workflow`, {
        action,
      });
      fetchOrders(); //refresh
    } catch (error) {
      console.log("WorkFlow Error ", error);
    }
  };

   

 const handleDispatch = async (orderId) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    await api.post(
      `http://localhost:3000/api/v1/order/${orderId}/admin-dispatch`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchOrders(); // refresh orders
  } catch (error) {
    console.log("handleDispatch error:", error);
  }
};

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      {/* HEADER */}
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

      {/* GRID */}
      <main className="grid-viewport">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No orders found</h3>
            <p>Once you receive orders, they will appear here.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order._id} className="grid-card-item">
                <OrderCard
                  order={order}
                  onWorkflow={handleWorkflow}
                  onDispatch={handleDispatch}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
