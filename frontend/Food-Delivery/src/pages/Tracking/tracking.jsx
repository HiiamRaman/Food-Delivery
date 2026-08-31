import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bike,
  CheckCircle2,
  Clock3,
  MapPin,
  Navigation,
  Route,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { socket } from "../../socket/clientSocket";
import Map from "../../socket/Map";

import "./tracking.css";

export default function Tracking() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const [riderPosition, setRiderPosition] = useState([
    27.7172,
    85.324,
  ]);

  const [fullRoute, setFullRoute] = useState([]);

  const [distance, setDistance] = useState(0);
  const [eta, setEta] = useState(0);

  const [hasArrived, setHasArrived] = useState(false);

  const routeRef = useRef([]);
  const hasArrivedRef = useRef(false);

  const SPEED = 30;

  // ================= SMOOTH MOVEMENT =================

  const smoothMove = (start, end, steps = 10) => {
    const frames = [];

    for (let i = 1; i <= steps; i++) {
      frames.push([
        start[0] +
          (end[0] - start[0]) * (i / steps),

        start[1] +
          (end[1] - start[1]) * (i / steps),
      ]);
    }

    return frames;
  };

  // ================= DISTANCE =================

  const getDistance = (a, b) => {
    const R = 6371;

    const dLat =
      ((b[0] - a[0]) * Math.PI) / 180;

    const dLng =
      ((b[1] - a[1]) * Math.PI) / 180;

    const lat1 = (a[0] * Math.PI) / 180;
    const lat2 = (b[0] * Math.PI) / 180;

    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLng / 2) ** 2 *
        Math.cos(lat1) *
        Math.cos(lat2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(x),
        Math.sqrt(1 - x),
      );

    return R * c;
  };

  // ================= SOCKET =================

  useEffect(() => {
    if (!orderId) return;

    const handleConnect = () => {
      console.log(
        "🟢 SOCKET CONNECTED:",
        socket.id,
      );

      socket.emit(
        "joinOrderTracking",
        orderId,
      );
    };

    const handleUpdate = (data) => {
      // Save route when backend sends it
      if (
        data.route &&
        routeRef.current.length === 0
      ) {
        const formattedRoute =
          data.route.map((point) => [
            point.lat,
            point.lng,
          ]);

        routeRef.current = formattedRoute;

        setFullRoute(formattedRoute);
      }

      if (!data.location) return;

      const newPosition = [
        data.location.lat,
        data.location.lng,
      ];

      // Smooth rider movement
      setRiderPosition((previousPosition) => {
        const frames = smoothMove(
          previousPosition,
          newPosition,
          8,
        );

        frames.forEach((frame, index) => {
          setTimeout(() => {
            setRiderPosition(frame);
          }, index * 80);
        });

        return newPosition;
      });

      // Get destination from latest route
      const route = routeRef.current;

      const destination =
        route[route.length - 1];

      if (!destination) return;

      const remainingDistance =
        getDistance(
          newPosition,
          destination,
        );

      setDistance(
        Number(remainingDistance.toFixed(2)),
      );

      const estimatedMinutes =
        (remainingDistance / SPEED) * 60;

      if (remainingDistance < 0.05) {
        setEta(0);
      } else {
        setEta(
          Math.max(
            1,
            Math.round(estimatedMinutes),
          ),
        );
      }

      // Rider arrived
      if (
        remainingDistance < 0.05 &&
        !hasArrivedRef.current
      ) {
        hasArrivedRef.current = true;

        setHasArrived(true);

        toast.success(
          "Rider has arrived!",
        );
      }
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on(
        "connect",
        handleConnect,
      );
    }

    socket.on(
      "riderLocationUpdate",
      handleUpdate,
    );

    return () => {
      socket.off(
        "connect",
        handleConnect,
      );

      socket.off(
        "riderLocationUpdate",
        handleUpdate,
      );
    };
  }, [orderId]);

  return (
    <div className="tracking-page">
      <div className="tracking-container">
        {/* ================= TOP BAR ================= */}

        <div className="tracking-topbar">
          <button
            type="button"
            className="tracking-back"
            onClick={() =>
              navigate("/my-orders")
            }
          >
            <ArrowLeft size={17} />

            My Orders
          </button>

          <div className="tracking-live-badge">
            <span />

            LIVE TRACKING
          </div>
        </div>

        {/* ================= HEADER ================= */}

        <div className="tracking-header">
          <div>
            <p className="tracking-eyebrow">
              DELIVERY IN PROGRESS
            </p>

            <h1>
              Your order is on the way
            </h1>

            <p className="tracking-subtitle">
              Follow your rider in real time
              until your order reaches you.
            </p>
          </div>

          <div className="tracking-order-id">
            <span>Order</span>

            <strong>
              #
              {orderId
                ?.slice(-6)
                .toUpperCase()}
            </strong>
          </div>
        </div>

        {/* ================= STATS ================= */}

        <div className="tracking-stats">
          <div className="tracking-stat-card">
            <div className="tracking-stat-icon">
              <Route size={20} />
            </div>

            <div>
              <span>Distance left</span>

              <strong>
                {distance} km
              </strong>
            </div>
          </div>

          <div className="tracking-stat-card">
            <div className="tracking-stat-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Estimated arrival</span>

              <strong>
                {eta > 0
                  ? `${eta} min`
                  : hasArrived
                    ? "Arrived"
                    : "Calculating"}
              </strong>
            </div>
          </div>

          <div className="tracking-stat-card">
            <div className="tracking-stat-icon">
              <Bike size={20} />
            </div>

            <div>
              <span>Delivery status</span>

              <strong>
                {hasArrived
                  ? "Rider arrived"
                  : "On the way"}
              </strong>
            </div>
          </div>
        </div>

        {/* ================= STATUS BANNER ================= */}

        <div
          className={`tracking-status-banner ${
            hasArrived ? "arrived" : ""
          }`}
        >
          <div className="tracking-status-icon">
            {hasArrived ? (
              <CheckCircle2 size={22} />
            ) : (
              <Navigation size={22} />
            )}
          </div>

          <div>
            <strong>
              {hasArrived
                ? "Your rider has arrived"
                : "Rider is heading to you"}
            </strong>

            <span>
              {hasArrived
                ? "Your order is now at the delivery location."
                : "Keep this page open to see live location updates."}
            </span>
          </div>
        </div>

        {/* ================= MAP ================= */}

        <section className="tracking-map-card">
          <div className="tracking-map-header">
            <div>
              <h2>Live location</h2>

              <p>
                Rider movement updates in
                real time.
              </p>
            </div>

            <div className="tracking-map-indicator">
              <MapPin size={16} />

              Destination
            </div>
          </div>

          <div className="map-wrapper">
            <Map
              riderPosition={riderPosition}
              route={fullRoute}
              restaurantPosition={[
                27.7172,
                85.324,
              ]}
              homePosition={[
                27.723,
                85.335,
              ]}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
