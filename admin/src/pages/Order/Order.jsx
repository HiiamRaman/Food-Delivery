import { useEffect, useState } from "react";
import {
  getAllOrders,
  adminDispatch,
  updateWorkflow,
} from "../../Api/order.api";
import OrderCard from "../../components/Order/Order.Card";
import "./Order.css";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
   

      const data = await getAllOrders();



      const orderList = data?.orders || data || [];

    

      setOrders(orderList);
    } catch (error) {
      console.log("❌ Admin Error (fetchOrders):");
      console.log("ERROR:", error);
      console.log("RESPONSE:", error.response);
      console.log("STATUS:", error.response?.status);
    }
  };

  // Workflow handler
  const handleWorkflow = async (orderId, action) => {
    try {
      

      await updateWorkflow(orderId, action);



      fetchOrders();
    } catch (error) {
      console.log("❌ WorkFlow Error:");
      console.log(error);
    }
  };

  // Dispatch handler
  const handleDispatch = async (orderId) => {
    try {
      

      await adminDispatch(orderId);

      console.log("✅ Dispatch success");

      fetchOrders();
    } catch (error) {
      console.log("❌ handleDispatch error:");
      console.log(error);
    }
  };

  useEffect(() => {
  
    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
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

      <main className="grid-viewport">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No orders found</h3>
            <p>Once you receive orders, they will appear here.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => {
              

              return (
                <div key={order._id} className="grid-card-item">
                  <OrderCard
                    order={order}
                    onWorkflow={handleWorkflow}
                    onDispatch={handleDispatch}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}