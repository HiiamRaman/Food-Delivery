// src/pages/Success/Success.jsx
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react"; // optional: you can use react-icons too
import "./Success.css";

function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("orderId");

  // Optional: redirect to home after few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000); // 10 seconds
    return () => clearTimeout(timer);
  }, [navigate]);

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
          Thank you for your order. Your payment has been completed successfully.
        </p>
        <button className="success-button" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Success;