// import { MapContainer, TileLayer, Marker } from "react-leaflet";
// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import "leaflet/dist/leaflet.css";

// // connect to backend socket
// const socket = io("http://localhost:3000");

// function LiveMap() {
//   const [position, setPosition] = useState([27.7172, 85.3240]); // default Kathmandu

//   useEffect(() => {
//     // listen for backend updates
//     socket.on("rider_location_update", (data) => {
//       console.log("Received:", data);

//       setPosition([data.lat, data.lng]);
//     });

//     return () => {
//       socket.off("rider_location_update");
//     };
//   }, []);

//   return (
//     <MapContainer center={position} zoom={14} style={{ height: "400px", width: "100%" }}>

//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {/* This marker moves */}
//       <Marker position={position} />

//     </MapContainer>
//   );
// }

// export default LiveMap;

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { bikeIcon } from "./MapIcon";
import { resturantIcon } from "./MapIcon";
import { homeIcon } from "./MapIcon";
// 1. Connect once. Using 'websocket' transport makes it much more stable.
const socket = io("http://localhost:3000", { transports: ["websocket"] });

// 2. HELPER: This component "grabs" the map and moves it to the new position
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position]); // Only runs when position changes
  return null;
}

function LiveMap() {
  const [position, setPosition] = useState([27.7172, 85.324]);
  const [route, setRoute] = useState([]);
  const startPoint = [27.7172, 85.324]; // Restaurant 🏪
  const endPoint = [27.729, 85.339]; // Customer 🏠
  useEffect(() => {
    // Listen for the update from the DJ (Backend)
    socket.on("rider_location_update", (data) => {
      console.log("Rider is at:", data);
      // Backend sends {lat, lng}, so we set it as an array for Leaflet
      setPosition([data.lat, data.lng]);
    });

    return () => {
      socket.off("rider_location_update");
    };
  }, []);

  const startDemo = () => {
    const path = [
      { lat: 27.7172, lng: 85.324 },
      { lat: 27.721, lng: 85.325 },
      { lat: 27.725, lng: 85.33 },
      { lat: 27.727, lng: 85.336 },
      { lat: 27.729, lng: 85.339 },
    ];
    setRoute(path);
    socket.emit("start_demo_route", path);
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={startDemo}
        style={{ marginBottom: "10px", padding: "10px", cursor: "pointer" }}
      >
        🚀 Start Delivery Demo
      </button>

      <MapContainer
        center={position}
        zoom={15}
        style={{ height: "500px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Moves the Map View */}
        <RecenterMap position={position} />

        {/* Moves the Blue Icon */}
        <Marker position={position} icon={bikeIcon} />

        {/* Restaurant (Start) */}
        <Marker position={startPoint} icon={resturantIcon} />
       <Marker position={endPoint}  icon={homeIcon}/>
        <Polyline
          positions={route.map((point) => [point.lat, point.lng])}
          color="blue"
        />
      </MapContainer>
    </div>
  );
}

export default LiveMap;
