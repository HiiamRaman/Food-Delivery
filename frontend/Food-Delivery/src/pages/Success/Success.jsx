import React, { useEffect, useContext, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import "./Success.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("🟢 Socket connected:", socket.id);
});

socket.on("disconnect", () => {});

function Success() {
  const { url, token, setCartItems } = useContext(StoreContext);
  const [trackingStarted, setTrackingStarted] = React.useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  // Use a ref to prevent double-calling in React Strict Mode
  const hasCalled = useRef(false);

  const startTracking = () => {
    console.log("🚀 Start Tracking clicked");

    const route = [
      { lat: 27.7172, lng: 85.324 },
      { lat: 27.721, lng: 85.325 },
      { lat: 27.725, lng: 85.33 },
      { lat: 27.727, lng: 85.336 },
      { lat: 27.729, lng: 85.339 },
    ];

    socket.emit("start_order_tracking", { route });

    setTrackingStarted(true);

    navigate(`/tracking/${orderId}`);
  };

  useEffect(() => {
    if (!orderId || !token || hasCalled.current) {
      console.log("⛔ Skipping execution", {
        orderId,
        token,
        alreadyCalled: hasCalled.current,
      });
      return;
    }

    hasCalled.current = true;

    const processPostPayment = async () => {
      try {
        console.log("📡 Calling payment success API...");

        // 1. Confirm Payment
        const paymentRes = await axios.post(`${url}/api/v1/payment/success`, {
          orderId,
          paymentId: "stripe_session_completed",
        });

        if (paymentRes.data.success) {
          await axios.delete(`${url}/api/v1/deleteCart/clear`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // 3. Clear Frontend Cart
          setCartItems({});

          // 4. Emit socket event
          const routeData = [
            { lat: 27.7172, lng: 85.324 },
            { lat: 27.721, lng: 85.325 },
            { lat: 27.725, lng: 85.33 },
            { lat: 27.727, lng: 85.336 },
            { lat: 27.729, lng: 85.339 },
          ];
        } else {
          console.log("❌ Payment not successful:", paymentRes.data);
        }
      } catch (error) {
        console.error(
          "❌ Success Page Error:",
          error.response?.data || error.message,
        );
      }
    };

    processPostPayment();

    const timer = setTimeout(() => {
      navigate("/myorders");
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [orderId, token, url, navigate, setCartItems]);

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="success-container">
      <div className="success-card">
        <CheckCircle size={64} color="#4BB543" className="success-icon" />
        <h1 className="success-title">Payment Successful!</h1>
        {orderId && (
          <p className="success-order-id">
            Your Order ID: <b>{orderId}</b>
          </p>
        )}
        <p className="success-message">
          Your rider will be assigned shortly. You can track your order in the
          "My Orders" section.
        </p>
        <button className="success-button" onClick={handleBackToHome}>
          Back to Home
        </button>
        <p>
          You want to track your food? <br />{" "}
          <button
            onClick={startTracking}
            disabled={trackingStarted}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: trackingStarted ? "gray" : "green",
              color: "white",
              cursor: "pointer",
            }}
          >
            {trackingStarted ? "Tracking Started 🚴" : "Start Tracking"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Success;
