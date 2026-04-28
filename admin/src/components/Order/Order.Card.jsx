export default function OrderCard({ order, onStatusChange }) {
  const handleChange = (e) => {
    const newStatus = e.target.value;

    console.log("🟠 [CARD] Dropdown changed");
    console.log("Order:", order._id);
    console.log("Selected:", newStatus);

    onStatusChange(order._id, newStatus);
  };

  return (
    <div style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
      <h4>Order: {order._id}</h4>
      <p>Status: {order.orderStatus}</p>

      <select value={order.orderStatus} onChange={handleChange}>
        <option value="placed">Placed</option>
        <option value="confirmed">Confirmed</option>
        <option value="preparing">Preparing</option>
        <option value="out_for_delivery">🚚 Out for delivery</option>
        <option value="delivered">Delivered</option>
      </select>
    </div>
  );
}