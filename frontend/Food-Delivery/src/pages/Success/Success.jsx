import React, { useEffect, useContext, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import "./Success.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";

function Success() {
  const { url, token, setCartItems } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  const hasCalled = useRef(false);

  useEffect(() => {
    if (!orderId || !token || hasCalled.current) return;

    hasCalled.current = true;

    const processPostPayment = async () => {
      try {
        console.log("📡 Confirming payment...");

        const paymentRes = await axios.post(`${url}/api/v1/payment/success`, {
          orderId,
          paymentId: "stripe_session_completed",
        });

        if (paymentRes.data.success) {
          // Clear backend cart
          await axios.delete(`${url}/api/v1/deleteCart/clear`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Clear frontend cart
          setCartItems({});

          console.log("✅ Payment + cart cleared");
        }
      } catch (error) {
        console.error(
          "❌ Error:",
          error.response?.data || error.message
        );
      }
    };

    processPostPayment();

  }, [orderId, token, url, setCartItems]);

  return (
    <div className="success-page">
  <div className="success-container">
    <div className="success-card">

      {/* ✅ Icon */}
      <div className="success-icon-wrapper">
        <CheckCircle size={70} className="success-icon" />
      </div>

      {/* ✅ Title */}
      <h1 className="success-title">Payment Successful!</h1>

      {/* ✅ Order ID */}
      {orderId && (
        <p className="success-order-id">
          Order ID: <span>{orderId}</span>
        </p>
      )}

      {/* ✅ Message */}
      <p className="success-message">
        Your order has been confirmed. You can track it in real-time.
      </p>

      {/* ✅ Buttons */}
      <div className="success-actions">
        <button
          className="success-button primary-btn"
          onClick={() => navigate(`/tracking/${orderId}`)}
        >
          🚚 Track Order
        </button>

        <button
          className="success-button secondary-btn"
          onClick={() => navigate("/")}
        >
          ⬅ Back Home
        </button>
      </div>

    </div>
  </div>
</div>
  );
}

export default Success;