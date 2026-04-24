// import { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import LiveMap from "../../socket/Map";
// import "./Tracking.css";
// import { useNavigate } from "react-router-dom";
// import { getRoute } from "../../Api/route.api.js";
// import polyline from "@mapbox/polyline";

// function Tracking() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // ---------------- STATE ----------------
//   const [route, setRoute] = useState([]);
//   const [position, setPosition] = useState([27.7172, 85.324]);
//   const [trail, setTrail] = useState([]);
//   const [eta, setEta] = useState(null);
//   const [isDelivered, setIsDelivered] = useState(false);

//   const [startPoint] = useState([27.7172, 85.324]);
//   const [endPoint, setEndPoint] = useState([27.729, 85.339]);

//   const [riderIndex, setRiderIndex] = useState(0);

//   const intervalRef = useRef(null);

//   // ---------------- RESET ON ORDER CHANGE ----------------
//   useEffect(() => {
//     setRoute([]);
//     setTrail([]);
//     setRiderIndex(0);
//     setIsDelivered(false);
//   }, [id]);

//   // ---------------- FETCH ROUTE ----------------
//   useEffect(() => {
//     const fetchRoute = async () => {
//       try {
//         const start = { lat: startPoint[0], lng: startPoint[1] };
//         const end = { lat: endPoint[0], lng: endPoint[1] };

//         const data = await getRoute(start, end);

//         const decoded = polyline.decode(data.geometry);

//         const formattedRoute = decoded.map(([lat, lng]) => ({
//           lat,
//           lng,
//         }));

//         setRoute(formattedRoute);
//         setEta(Math.ceil(data.duration / 60));
//       } catch (err) {
//         console.log("Route fetch error:", err);
//       }
//     };

//     fetchRoute();
//   }, [id, endPoint]);

//   // ---------------- RIDER MOVEMENT ENGINE ----------------
//   useEffect(() => {
//     if (!route.length) return;

//     if (intervalRef.current) clearInterval(intervalRef.current);

//     intervalRef.current = setInterval(() => {
//       setRiderIndex((prev) => {
//         if (prev >= route.length - 1) {
//           clearInterval(intervalRef.current);
//           setIsDelivered(true);
//           return prev;
//         }
//         return prev + 1;
//       });
//     }, 1000);

//     return () => clearInterval(intervalRef.current);
//   }, [route]);

//   // ---------------- POSITION UPDATE ----------------
//   useEffect(() => {
//     if (!route.length) return;

//     const current = route[riderIndex];
//     if (!current) return;

//     setPosition([current.lat, current.lng]);
//     setTrail((prev) => [...prev, current]);
//   }, [riderIndex, route]);

//   // ---------------- ACTION ----------------
//   const changeDestination = () => {
//     setEndPoint([27.735, 85.345]);
//   };

//   // ---------------- UI ----------------
//   return (
//     <div className="tracking-container">

//       <div className="tracking-header">
//         <div className="tracking-title">🚴 Live Order Tracking</div>
//         <div className="tracking-status">On the way</div>

//         <button onClick={changeDestination}>
//           Change Destination
//         </button>
//       </div>

//       <div className="map-wrapper">
//         <LiveMap
//           position={position}
//           startPoint={startPoint}
//           endPoint={endPoint}
//           route={route}
//           trail={trail}
//         />

//         {isDelivered && (
//           <button
//             onClick={() => navigate("/")}
//             className="delivered-btn"
//           >
//             🏠 Go to Home
//           </button>
//         )}
//       </div>

//       <div className="tracking-info">
//   <p>
//     <b>Order ID</b>
//     <span>{id}</span>
//   </p>

//   <p>
//     <b>Status</b>
//     <span>Moving</span>
//   </p>

//   <p>
//     <b>ETA</b>
//     <span className="eta">
//       {eta ? `${eta} mins` : "Calculating..."}
//     </span>
//   </p>

//   <p>
//     <b>Updates</b>
//     <span>Live</span>
//   </p>
// </div>
//     </div>
//   );
// }

// export default Tracking;



























// IF U WANT SOCKET EXAMPLE UNCOMMENT THIS


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LiveMap from "../../socket/Map";
import { socket } from "../../socket/socket";
import "./Tracking.css";
import { getRoute } from "../../Api/route.api.js";
import polyline from "@mapbox/polyline";

function Tracking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trail, setTrail] = useState([]);
  const [eta, setEta] = useState(null);

  const [position, setPosition] = useState([27.7172, 85.324]);

  const [route, setRoute] = useState([]);
  const [isDelivered, setIsDelivered] = useState(false);

  const [startPoint] = useState([27.7172, 85.324]);

  // ✅ FIXED: endpoint is now dynamic
  const [endPoint, setEndPoint] = useState([27.729, 85.339]);

  // Reset route when order changes
  useEffect(() => {
    setRoute([]);
    setTrail([]);
  }, [id]);

  // 🔷 ROUTE FETCH (REACTS TO ENDPOINT CHANGE)
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const start = { lat: startPoint[0], lng: startPoint[1] };
        const end = { lat: endPoint[0], lng: endPoint[1] };

        const data = await getRoute(start, end);

        const decoded = polyline.decode(data.geometry);

        const routeCoords = decoded.map(([lat, lng]) => ({
          lat,
          lng,
        }));

        setRoute(routeCoords);
        setEta(Math.ceil(data.duration / 60));
      } catch (err) {
        console.log("Route fetch error:", err);
      }
    };

    fetchRoute();
  }, [id, endPoint]);

  // 🔷 SOCKET: rider live location
  useEffect(() => {
    socket.on("rider_location_update", (data) => {
      if (
        !data ||
        typeof data.lat !== "number" ||
        typeof data.lng !== "number"
      ) {
        return;
      }

      setPosition([data.lat, data.lng]);
      setTrail((prev) => [...prev, data]);
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

  // 🔷 CHANGE DESTINATION (TEST FUNCTION)
  const changeDestination = () => {
    setEndPoint([27.735, 85.345]);
  };

  return (
    <div className="tracking-container">
      {/* Header */}
      <div className="tracking-header">
        <div className="tracking-title">🚴 Live Order Tracking</div>
        <div className="tracking-status">On the way</div>

        <button onClick={changeDestination}>Change Destination</button>
      </div>

      {/* Map */}
      <div className="map-wrapper">
        <LiveMap
          position={position}
          startPoint={startPoint}
          endPoint={endPoint}
          route={route}
          trail={trail}
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
          <b>Rider Status:</b> Moving to destination <br />
          <b>ETA:</b> {eta ? `${eta} mins` : "Calculating..."}
        </p>

        <p>
          <b>Live Updates:</b> Active
        </p>
      </div>
    </div>
  );
}

export default Tracking;
