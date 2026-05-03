import React, { useEffect, useState } from "react";
import { socket } from "../../socket/clientSocket";
import Map from "../../socket/Map";
import { useParams } from "react-router-dom";
import "./Tracking.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function Tracking() {
  const { id: orderId } = useParams();

  const [riderPosition, setRiderPosition] = useState([27.7172, 85.324]);
  const [fullRoute, setFullRoute] = useState([]);
  const [distance, setDistance] = useState(0);
  const [eta, setEta] = useState(0);
  const navigate = useNavigate();
  const SPEED = 30;
  const [hasArrived, setHasArrived] = useState(false);

  const smoothMove = (start, end, steps = 10) => {
    const frames = [];
    for (let i = 1; i <= steps; i++) {
      frames.push([
        start[0] + (end[0] - start[0]) * (i / steps),
        start[1] + (end[1] - start[1]) * (i / steps),
      ]);
    }
    return frames;
  };

  const getDistance = (a, b) => {
    const R = 6371;
    const dLat = ((b[0] - a[0]) * Math.PI) / 180;
    const dLng = ((b[1] - a[1]) * Math.PI) / 180;
    const lat1 = (a[0] * Math.PI) / 180;
    const lat2 = (b[0] * Math.PI) / 180;

    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    return R * c;
  };

  useEffect(() => {
    if (!orderId) return;

    const handleConnect = () => {
      console.log("🟢 SOCKET CONNECTED:", socket.id);
      socket.emit("joinOrderTracking", orderId);
    };

    const handleUpdate = (data) => {
      if (data.route && fullRoute.length === 0) {
        const formatted = data.route.map((p) => [p.lat, p.lng]);
        setFullRoute(formatted);
      }

      if (!data.location) return;
      const newPos = [data.location.lat, data.location.lng];

      setRiderPosition((prev) => {
        const frames = smoothMove(prev, newPos, 8);
        frames.forEach((frame, index) => {
          setTimeout(() => setRiderPosition(frame), index * 80);
        });
        return newPos;
      });

      const destination = fullRoute[fullRoute.length - 1];
      if (destination) {
        const dist = getDistance(newPos, destination);
        setDistance(dist.toFixed(2));

        const etaMinutes = (dist / SPEED) * 60;
        if (dist < 0.05) {
          // ~50 meters
          setEta(0);
        } else {
          setEta(Math.round(etaMinutes));
        }
        if (dist < 0.05 && !hasArrived) {
          toast.success("🚴 Rider has arrived!");
          setHasArrived(true);
        }
      }

      // if (data.status === "arrived") {
      //   alert("🚴 Rider has arrived!");
      // }
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on("connect", handleConnect);
    }

    socket.on("riderLocationUpdate", handleUpdate);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("riderLocationUpdate", handleUpdate);
    };
  }, [orderId, fullRoute.length]);

  return (
    <div className="tracking-page">
      <div className="tracking-container">
        {/* 🔝 Header */}
        <div className="tracking-header">
          <h2 className="tracking-title">Live Order Tracking</h2>
          <p className="tracking-subtitle">Track your order in real time</p>
        </div>

        {/* 📊 Stats */}
        <div className="tracking-stats">
          <div className="stat-card distance-card">
            <div className="stat-icon">📏</div>
            <div className="stat-info">
              <p className="stat-label">Distance Left</p>
              <h3 className="stat-value">{distance} km</h3>
            </div>
          </div>

          <div className="stat-card eta-card">
            <div className="stat-icon">⏱</div>
            <div className="stat-info">
              <p className="stat-label">Estimated Time</p>
              <h3 className="stat-value">{eta} min</h3>
            </div>
          </div>
          <button className="back-home-btn" onClick={() => navigate("/")}>
            ⬅ Back to Home
          </button>
        </div>

        {/* 🗺 Map */}
        <div className="map-section">
          <div className="map-wrapper">
            <Map
              riderPosition={riderPosition}
              route={fullRoute}
              restaurantPosition={[27.7172, 85.324]}
              homePosition={[27.723, 85.335]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
