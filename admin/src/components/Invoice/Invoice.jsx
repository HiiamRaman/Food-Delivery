// components/Invoice/Invoice.jsx

import React from "react";
import "./Invoice.css";

export default function Invoice({ order }) {
  if (!order) return null;

  return (
    <div className="invoice">
      <div className="invoice-header">
        <div>
          <h1>Food Delivery</h1>
          <p>Order Invoice</p>
        </div>

        <div className="invoice-number">
          <span>INVOICE</span>
          <strong>#{order._id?.slice(-8)}</strong>
        </div>
      </div>

      <hr />

      <div className="invoice-info">
        <div>
          <h3>Bill To</h3>

          <p>
            {order.user?.fullname ||
              order.user?.username ||
              "Customer"}
          </p>

          <p>{order.user?.email}</p>
          <p>{order.deliveryAddress?.phone}</p>
        </div>

        <div>
          <h3>Order Details</h3>

          <p>
            Order ID: #{order._id?.slice(-8)}
          </p>

          <p>
            Date:{" "}
            {new Date(
              order.createdAt
            ).toLocaleDateString()}
          </p>

          <p>Status: {order.orderStatus}</p>
        </div>
      </div>

      <div className="invoice-address">
        <h3>Delivery Address</h3>

        <p>
          {order.deliveryAddress?.street},{" "}
          {order.deliveryAddress?.city},{" "}
          {order.deliveryAddress?.state},{" "}
          {order.deliveryAddress?.country}
        </p>
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {order.items?.map((item, index) => (
            <tr key={item.food || index}>
              <td>{item.name}</td>

              <td>Rs. {item.price}</td>

              <td>{item.quantity}</td>

              <td>
                Rs. {item.price * item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-total">
        <p>
          <span>Subtotal</span>
          <strong>
            Rs. {order.pricing?.subTotal || 0}
          </strong>
        </p>

        <p>
          <span>Delivery Fee</span>
          <strong>
            Rs. {order.pricing?.deliveryFee || 0}
          </strong>
        </p>

        <p className="grand-total">
          <span>Total</span>
          <strong>
            Rs. {order.pricing?.totalAmount || 0}
          </strong>
        </p>
      </div>

      <div className="invoice-footer">
        <p>
          Payment: {order.payment?.method || "-"}
        </p>

        <p>
          Payment Status:{" "}
          {order.payment?.status || "-"}
        </p>

        <h3>Thank you for your order!</h3>
      </div>
    </div>
  );
}
