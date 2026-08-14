// import React from "react";
// import "./Order.Card.css";

// export default function OrderCard({ order, onWorkflow, onDispatch, updating }) {
//   const isUpdating = updating === true;

//   return (
//     <div className="order-card">
//       {/* =========================================
//           ORDER HEADER
//       ========================================= */}

//       <div className="order-card-header">
//         <h4>Order: {order._id}</h4>

//         <span className={`status-badge status-${order.orderStatus}`}>
//           {order.orderStatus}
//         </span>
//       </div>

//       {/* =========================================
//           ORDER STATUS
//       ========================================= */}

//       <p className="order-status">
//         Status:
//         <b>{order.orderStatus}</b>
//       </p>

//       {/* =========================================
//           PLACED → CONFIRMED
//       ========================================= */}

//       {order.orderStatus === "placed" && (
//         <button
//           onClick={() => onWorkflow(order._id, "confirm")}
//           disabled={isUpdating}
//           className="workflow-btn"
//         >
//           {isUpdating ? "⏳ Updating..." : "🔄 Confirm Order"}
//         </button>
//       )}

//       {/* =========================================
//           CONFIRMED → PREPARING
//       ========================================= */}

//       {order.orderStatus === "confirmed" && (
//         <button
//           onClick={() => onWorkflow(order._id, "prepare")}
//           disabled={isUpdating}
//           className="workflow-btn"
//         >
//           {isUpdating ? "⏳ Updating..." : "🔄 Start Preparing"}
//         </button>
//       )}

//       {/* =========================================
//           PREPARING → DISPATCH
//       ========================================= */}

//       {order.orderStatus === "preparing" && (
//         <button
//           onClick={() => onDispatch(order._id)}
//           disabled={isUpdating}
//           className="dispatch-btn"
//         >
//           {isUpdating ? "⏳ Dispatching..." : "🚚 Dispatch Order"}
//         </button>
//       )}

//       {/* =========================================
//           DELIVERED
//       ========================================= */}

//       {order.orderStatus === "delivered" && (
//         <button disabled className="done-btn">
//           ✔ Delivered
//         </button>
//       )}

//       {/* =========================================
//           CANCELLED
//       ========================================= */}

//       {order.orderStatus === "cancelled" && (
//         <button disabled className="cancelled-btn">
//           ✕ Cancelled
//         </button>
//       )}
//     </div>
//   );
// }












import React from "react";
import "./Order.Card.css";

export default function OrderCard({
  order,
  onWorkflow,
  onDispatch,
  updating,
}) {
  const isUpdating = updating === true;

  return (
    <div className="order-card">

      {/* =========================================
          ORDER HEADER
      ========================================= */}

      <div className="order-card-header">

        <h4>
          Order: {order._id}
        </h4>

        <span
          className={`status-badge status-${order.orderStatus}`}
        >
          {order.orderStatus}
        </span>

      </div>


      {/* =========================================
          CUSTOMER INFORMATION
      ========================================= */}

      <div className="customer-info">

        <p>
          👤 Username:{" "}
          <b>
            {order.user?.username || "Unknown"}
          </b>
        </p>

       

        <p>
          📧 Email:{" "}
          <b>
            {order.user?.email || "Unknown"}
          </b>
        </p>

      </div>


      {/* =========================================
          ORDER STATUS
      ========================================= */}

      <p className="order-status">

        Status:

        <b>
          {order.orderStatus}
        </b>

      </p>


      {/* =========================================
          PLACED → CONFIRMED
      ========================================= */}

      {order.orderStatus === "placed" && (

        <button
          onClick={() =>
            onWorkflow(
              order._id,
              "confirm"
            )
          }
          disabled={isUpdating}
          className="workflow-btn"
        >
          {isUpdating
            ? "⏳ Updating..."
            : "🔄 Confirm Order"}
        </button>

      )}


      {/* =========================================
          CONFIRMED → PREPARING
      ========================================= */}

      {order.orderStatus === "confirmed" && (

        <button
          onClick={() =>
            onWorkflow(
              order._id,
              "prepare"
            )
          }
          disabled={isUpdating}
          className="workflow-btn"
        >
          {isUpdating
            ? "⏳ Updating..."
            : "🔄 Start Preparing"}
        </button>

      )}


      {/* =========================================
          PREPARING → DISPATCH
      ========================================= */}

      {order.orderStatus === "preparing" && (

        <button
          onClick={() =>
            onDispatch(order._id)
          }
          disabled={isUpdating}
          className="dispatch-btn"
        >
          {isUpdating
            ? "⏳ Dispatching..."
            : "🚚 Dispatch Order"}
        </button>

      )}


      {/* =========================================
          DELIVERED
      ========================================= */}

      {order.orderStatus === "delivered" && (

        <button
          disabled
          className="done-btn"
        >
          ✔ Delivered
        </button>

      )}


      {/* =========================================
          CANCELLED
      ========================================= */}

      {order.orderStatus === "cancelled" && (

        <button
          disabled
          className="cancelled-btn"
        >
          ✕ Cancelled
        </button>

      )}

    </div>
  );
}
