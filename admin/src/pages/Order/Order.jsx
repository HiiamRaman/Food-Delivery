// import { useEffect, useState } from "react";
// import api from "../../api/axios";
// import OrderCard from "../../components/Order/Order.Card";
// import './Order.css'
// export default function OrdersPage() {
//   const [orders, setOrders] = useState([]);

//   // =====================
//   // FETCH ORDERS
//   // =====================
//   const fetchOrders = async () => {
//     try {
//       console.log("🔵 [ADMIN] Fetching orders...");

//       const res = await api.get("http://localhost:3000/api/v1/order/allorders");

//       console.log("🟢 [ADMIN] Orders received:", res.data);

//       const data = Array.isArray(res.data)
//         ? res.data
//         : res.data.orders || [];

//       setOrders(data);
//     } catch (err) {
//       console.error("🔴 [ADMIN ERROR]", err);
//     }
//   };

//   // =====================
//   // STATUS UPDATE
//   // =====================
//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       console.log("🟡 [ADMIN] Updating status...");
//       console.log("Order:", orderId);
//       console.log("New Status:", newStatus);

//       const res = await api.patch(`/api/v1/order/${orderId}/status`, {
//         status: newStatus,
//       });

//       console.log("🟢 [ADMIN] Status updated:", res.data);

//       // update UI instantly
//       setOrders((prev) =>
//         prev.map((order) =>
//           order._id === orderId
//             ? { ...order, orderStatus: newStatus }
//             : order
//         )
//       );
//     } catch (err) {
//       console.error("🔴 [STATUS ERROR]", err);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//  return (
//   <div className="orders-page">
    
//     {/* HEADER */}
//     <div className="orders-header">
//       <h2>📦 Admin Orders</h2>
//       <p className="sub-text">Manage and track all incoming orders</p>
//     </div>

//     {/* GRID WRAPPER */}
//     <div className="orders-wrapper">
//       {orders.length === 0 ? (
//         <div className="empty-state">No orders found</div>
//       ) : (
//         orders.map((order) => (
//           <OrderCard
//             key={order._id}
//             order={order}
//             onStatusChange={handleStatusChange}
//           />
//         ))
//       )}
//     </div>
//   </div>
// );
// }
















import { useEffect, useState } from "react";
import api from "../../api/axios";
import OrderCard from "../../components/Order/Order.Card";
import './Order.css'

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("http://localhost:3000/api/v1/order/allorders");
      const data = Array.isArray(res.data) ? res.data : res.data.orders || [];
      setOrders(data);
    } catch (err) {
      console.error("🔴 [ADMIN ERROR]", err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/api/v1/order/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      console.error("🔴 [STATUS ERROR]", err);
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

      {/* GRID SECTION */}
      <main className="grid-viewport">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No orders found</h3>
            <p>Once you receive orders, they will appear here in a grid.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order._id} className="grid-card-item">
                <OrderCard
                  order={order}
                  onStatusChange={handleStatusChange}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}