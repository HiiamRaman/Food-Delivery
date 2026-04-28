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

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import LiveMap from "../../socket/Map";
// import { socket } from "../../socket/socket";
// import "./Tracking.css";
// import { getRoute } from "../../Api/route.api.js";
// import polyline from "@mapbox/polyline";

// function Tracking() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [trail, setTrail] = useState([]);
//   const [eta, setEta] = useState(null);

//   const [position, setPosition] = useState([27.7172, 85.324]);

//   const [route, setRoute] = useState([]);
//   const [isDelivered, setIsDelivered] = useState(false);

//   const [startPoint] = useState([27.7172, 85.324]);

//   // ✅ FIXED: endpoint is now dynamic
//   const [endPoint, setEndPoint] = useState([27.729, 85.339]);
//   const [orderStatus, setOrderStatus] = useState("confirmed");

//   // Reset route when order changes
//   useEffect(() => {
//     setRoute([]);
//     setTrail([]);
//   }, [id]);

//   // 🔷 ROUTE FETCH (REACTS TO ENDPOINT CHANGE)
//   useEffect(() => {
//     const fetchRoute = async () => {
//       try {
//         const start = { lat: startPoint[0], lng: startPoint[1] };
//         const end = { lat: endPoint[0], lng: endPoint[1] };

//         const data = await getRoute(start, end);

//         const decoded = polyline.decode(data.geometry);

//         const routeCoords = decoded.map(([lat, lng]) => ({
//           lat,
//           lng,
//         }));

//         setRoute(routeCoords);
//         setEta(Math.ceil(data.duration / 60));
//       } catch (err) {
//         console.log("Route fetch error:", err);
//       }
//     };

//     fetchRoute();
//   }, [id, endPoint]);

//   // 🔷 SOCKET: rider live location
//   useEffect(() => {
//     socket.emit("join_order", id);
    


//   const handleReconnect = ()=>{
//     console.log("Reconnected!!!")
//     socket.emit("join_order",id)
//   }

//     const handleLocation = (data) => {
//       console.log("Rider",data);
//       if (
//         !data ||
//         typeof data.lat !== "number" ||
//         typeof data.lng !== "number"
//       ) {
//         return;
//       }
//           console.log("📍 rider update:", data); // ✅ DEBUG HERE
//       if (orderStatus !== "out_for_delivery") return;
//       setPosition([data.lat, data.lng]);
//       setTrail((prev) => {
//         const updated = [...prev, data];
//         return updated.slice(-100); // prevent lag
//       });
//     };
//   const handleStatus = (data)=>{
//      console.log("📦 status:", data.status); // ✅ DEBUG HERE
//     setOrderStatus(data.status);

//   }
//   const handleDelivery = () => {
//     console.log("✅ Delivered");
//     setIsDelivered(true);
//     setOrderStatus("delivered");
//   };



//     socket.on("rider_location_update", handleLocation);
//     // ORDER STATUS UPDATE
//     socket.on("order_status_changed", handleStatus);

//     // DELIVERY COMPLETED
//     socket.on("delivery_completed", handleDelivery);
//     //reconnect
//     socket.on("connect",handleReconnect)

//     return () => {
//       socket.off("rider_location_update",handleLocation);
//       socket.off("delivery_completed",handleDelivery);
//       socket.off("order_status_changed",handleStatus);
//       socket.off("connect",handleReconnect)
//     };
//   }, [id]);

//   // 🔷 CHANGE DESTINATION (TEST FUNCTION)
//   const changeDestination = () => {
//     setEndPoint([27.735, 85.345]);
//   };

//   return (
//     <div className="tracking-container">
//       {/* Header */}
//       <div className="tracking-header">
//         <div className="tracking-title">🚴 Live Order Tracking</div>
//         <div className="tracking-status">
//           {orderStatus === "confirmed" && "Order Confirmed"}
//           {orderStatus === "preparing" && "Preparing Food 🍳"}
//           {orderStatus === "out_for_delivery" && "Rider on the way 🚴"}
//           {orderStatus === "delivered" && "Delivered 🎉"}
//         </div>

//         <button onClick={changeDestination}>Change Destination</button>
//       </div>

//       {/* Map */}
//       <div className="map-wrapper">
//         <LiveMap
//           position={position}
//           startPoint={startPoint}
//           endPoint={endPoint}
//           route={route}
//           trail={trail}
//         />

//         {isDelivered && (
//           <button onClick={() => navigate("/")} className="delivered-btn">
//             🏠 Go to Home
//           </button>
//         )}
//       </div>

//       {/* Info */}
//       <div className="tracking-info">
//         <p>
//           <b>Order ID:</b> {id}
//         </p>

//         <p>
//           <b>Rider Status:</b>{orderStatus} <br />
//           <b>ETA:</b> {eta ? `${eta} mins` : "Calculating..."}
//         </p>

//         <p>
//           <b>Live Tracking:</b>{" "}
//           {orderStatus === "out_for_delivery" ? "Active" : "Waiting..."}
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Tracking;



























import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LiveMap from "../../socket/Map";
import { getRoute } from "../../Api/route.api.js";
import polyline from "@mapbox/polyline";
import { socket } from "../../socket/socket";

function Tracking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [position, setPosition] = useState([27.7172, 85.324]);
  const [status, setStatus] = useState("confirmed");
  const [delivered, setDelivered] = useState(false);

  // join room
// useEffect(() => {
//   if (!id) return;

//   socket.emit("join_order", id);

//   console.log("🔌 Joined:", id);

//   socket.on("admin:dispatch_order", (data) => {
//     console.log("🚀 DISPATCH RECEIVED:", data);

//     const route = data.route;

//     if (!route || route.length === 0) {
//       console.warn("⚠️ Empty route received");
//       return;
//     }

//     let i = 0;

//     const interval = setInterval(() => {
//       if (i >= route.length) {
//         clearInterval(interval);
//         console.log("🏁 Movement finished");
//         return;
//       }

//       console.log("📡 MOVING TO:", route[i]);

//       setPosition([route[i].lat, route[i].lng]);

//       i++;
//     }, 2000);
//   });

//   return () => {
//     socket.off("admin:dispatch_order");
//   };
// }, [id]);
useEffect(() => {
  if (!id) return;

  socket.emit("join_order", id);

  const handleMove = (data) => {
    setPosition([data.lat, data.lng]);
  };

  socket.on("order:location_update", handleMove);

  socket.on("order:delivered", () => {
    console.log("DELIVERED");
  });

  return () => {
    socket.off("order:location_update", handleMove);
    socket.off("order:delivered");
  };
}, [id]);
  return (
    <div>

      {/* STATUS */}
      <h2>Status: {status}</h2>

      {/* MAP */}
      <LiveMap position={position} />

      {/* DELIVERY OVERLAY */}
      {delivered && (
        <div>
          <h3>🎉 Delivered</h3>
          <button onClick={() => navigate("/")}>Home</button>
        </div>
      )}

    </div>
  );
}

export default Tracking;

