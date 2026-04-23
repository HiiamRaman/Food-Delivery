import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LiveMap from "../../socket/Map";
import { socket } from "../../socket/socket";
import "./Tracking.css";
import { useNavigate } from "react-router-dom";
function Tracking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [position, setPosition] = useState([27.7172, 85.324]);
  const [route, setRoute] = useState([]);
  const [isDelivered, setIsDelivered] = useState(false);
  const [startPoint] = useState([27.7172, 85.324]); // Restaurant coords
  const [endPoint] = useState([27.729, 85.339]); // Customer coords

  // Reset the route when the order changes

  useEffect(() => {
    setRoute([]);
  }, [id]);

  useEffect(() => {
    socket.on("rider_location_update", (data) => {
      if (
        !data ||
        typeof data.lat !== "number" ||
        typeof data.lng !== "number"
      ) {
        return; // ignore bad data
      }
      setPosition([data.lat, data.lng]);
      setRoute((prev) => [...prev, data]);
    });
    socket.on("delivery_completed", () => {
      console.log("✅ Delivered");
      setIsDelivered(true);
    });

    return () => {
      socket.off("rider_location_update");
      socket.off("delivery_completed");
    };
  }, [id]);

  return (
    <div className="tracking-container">
      {/* Header */}
      <div className="tracking-header">
        <div className="tracking-title">🚴 Live Order Tracking</div>
        <div className="tracking-status">On the way</div>
      </div>

      {/* Map */}
      <div className="map-wrapper">
        <LiveMap
          position={position}
          startPoint={startPoint}
          endPoint={endPoint}
          route={route}
        />
        {isDelivered && (
          <button onClick={() => navigate("/")} className="delivered-btn">
            🏠 Go to Home
          </button>
        )}
      </div>

      {/* Info */}
      <div className="tracking-info">
        <p>
          <b>Order ID:</b> {id}
        </p>
        <p>
          <b>Rider Status:</b> Moving to destination
        </p>
        <p>
          <b>Live Updates:</b> Active
        </p>
      </div>
    </div>
  );
}

export default Tracking;
