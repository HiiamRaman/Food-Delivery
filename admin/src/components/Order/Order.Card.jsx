import './Order.Card.css'
export default function OrderCard({ order, onWorkflow, onDispatch }) {
  return (
    <div className="order-card">

      <h4>Order: {order._id}</h4>

      <p>
        Status: <b>{order.orderStatus}</b>
      </p>

      {/* 🔄 Workflow Button (step progression  CONFIRM STEP 1) */}
      {order.orderStatus == "placed"  && (
        <button
          onClick={() => onWorkflow(order._id,"confirm")}
          className="workflow-btn"
        >
          🔄 Next Step
        </button>
      )}
      {/* 🔄 Workflow Button (step progression  prepare STEP 1) */}
      {order.orderStatus == "confirmed"  && (
        <button
          onClick={() => onWorkflow(order._id,"prepare")}
          className="workflow-btn"
        >
          🔄 Next Step
        </button>
      )}

      {/* 🚚 Dispatch Button (final stage) */}
      {order.orderStatus === "preparing" && (
        <button
          onClick={() => onDispatch(order._id,"preparing")}
          className="dispatch-btn"
        >
          🚚 Dispatch Order
        </button>
      )}

      {/* ✅ Delivered State */}
      {order.orderStatus === "delivered" && (
        <button disabled className="done-btn">
          ✔ Delivered
        </button>
      )}

    </div>
  );
}