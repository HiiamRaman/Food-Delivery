import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  MapPinned,
  PackageCheck,
} from "lucide-react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { StoreContext } from "../../Context/StoreContext";
import api from "../../utils/axios.client";

import "./Success.css";

function Success() {
  const {
    token,
    setCartItems,
  } = useContext(StoreContext);

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const orderId =
    searchParams.get("orderId");

  const hasCalled = useRef(false);

  const [processing, setProcessing] =
    useState(true);

  const [paymentConfirmed, setPaymentConfirmed] =
    useState(false);

  // ================= POST PAYMENT =================

  useEffect(() => {
    if (
      !orderId ||
      !token ||
      hasCalled.current
    ) {
      return;
    }

    hasCalled.current = true;

    const processPostPayment = async () => {
      try {
        setProcessing(true);

        // Confirm payment
        const paymentResponse = await api.post(
          "/api/v1/payment/success",
          {
            orderId,
            paymentId:
              "stripe_session_completed",
          },
        );

        if (!paymentResponse.data?.success) {
          return;
        }

        // Clear backend cart
        await api.delete(
          "/api/v1/deleteCart/clear",
        );

        // Clear frontend cart
        setCartItems({});

        setPaymentConfirmed(true);
      } catch (error) {
        console.error(
          "POST PAYMENT ERROR:",
          error.response?.data ||
            error.message,
        );
      } finally {
        setProcessing(false);
      }
    };

    processPostPayment();
  }, [
    orderId,
    token,
    setCartItems,
  ]);

  const shortOrderId = orderId
    ? orderId.slice(-8).toUpperCase()
    : "N/A";

  return (
    <div className="success-page">
      <div className="success-wrapper">
        {/* ================= STATUS ICON ================= */}

        <div
          className={`success-icon-box ${
            processing ? "processing" : ""
          }`}
        >
          {processing ? (
            <LoaderCircle
              size={38}
              className="success-spinner"
            />
          ) : (
            <CheckCircle2 size={42} />
          )}
        </div>

        {/* ================= STATUS ================= */}

        <span className="success-eyebrow">
          {processing
            ? "FINALIZING ORDER"
            : "ORDER CONFIRMED"}
        </span>

        <h1>
          {processing
            ? "Confirming your payment..."
            : "Payment successful!"}
        </h1>

        <p className="success-description">
          {processing
            ? "We're finishing your order and preparing it for tracking."
            : "Your order has been confirmed and is now being prepared."}
        </p>

        {/* ================= ORDER CARD ================= */}

        <div className="success-order-card">
          <div className="success-order-icon">
            <PackageCheck size={21} />
          </div>

          <div className="success-order-content">
            <span>Order reference</span>

            <strong>
              #{shortOrderId}
            </strong>

            {orderId && (
              <small>
                {orderId}
              </small>
            )}
          </div>

          <div
            className={`success-payment-status ${
              paymentConfirmed
                ? "confirmed"
                : ""
            }`}
          >
            <span />

            {processing
              ? "Processing"
              : "Paid"}
          </div>
        </div>

        {/* ================= NEXT STEP ================= */}

        {!processing && (
          <div className="success-next-step">
            <div>
              <MapPinned size={19} />
            </div>

            <p>
              You can now follow your order
              and rider from the live tracking
              page.
            </p>
          </div>
        )}

        {/* ================= ACTIONS ================= */}

        <div className="success-actions">
          <button
            type="button"
            className="success-primary-btn"
            disabled={
              processing || !orderId
            }
            onClick={() =>
              navigate(
                `/tracking/${orderId}`,
              )
            }
          >
            {processing ? (
              <LoaderCircle
                size={18}
                className="button-spinner"
              />
            ) : (
              <MapPinned size={18} />
            )}

            {processing
              ? "Preparing tracking..."
              : "Track order"}
          </button>

          <button
            type="button"
            className="success-secondary-btn"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={17} />

            Back to home
          </button>
        </div>

        {/* ================= FOOT NOTE ================= */}

        <p className="success-footnote">
          Keep your order reference for future
          support or tracking.
        </p>
      </div>
    </div>
  );
}

export default Success;
