import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { socket } from "./socket.js";

function Map() {
  // 🚴 Rider location (live)
  const [riderLocation, setRiderLocation] = useState({
    lat: 27.7200,
    lng: 85.3300,
  });

  // 🔵 Demo route (static path)
  const routePath = [   // blue line
    { lat: 27.7172, lng: 85.3240 },
    { lat: 27.7180, lng: 85.3250 },
    { lat: 27.7188, lng: 85.3258 },
    { lat: 27.7195, lng: 85.3265 },
    { lat: 27.7202, lng: 85.3272 },
    { lat: 27.7210, lng: 85.3310 },
  ];

  const mapRef = useRef(null);

  const containerStyle = {
    width: "100%",
    height: "500px",
  };

  // 🧠 FIX 1: Prevent duplicate listeners
  useEffect(() => {
    const handleLocation = (data) => {
      if (!data) return;

      setRiderLocation({                   // moving marker
        lat: Number(data.lat),
        lng: Number(data.lng),
      });
    };

    socket.on("rider_location_update", handleLocation);

    return () => {
      socket.off("rider_location_update", handleLocation);
    };
  }, []);

  // 🧠 FIX 2: Emit route only once (safe + stable)
  useEffect(() => {
    socket.emit("start_demo_route", routePath);
  }, []);

  // 🧠 Optional UX improvement: smooth map tracking
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo(riderLocation);
    }
  }, [riderLocation]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyCNx-jLKHwMxicLIipHR3z9fs-KcAvLFkU">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={riderLocation}
        zoom={15}
        onLoad={(map) => (mapRef.current = map)}
      >
        {/* 🚴 Rider Marker */}
        <Marker position={riderLocation} label="R" />

        {/* 🏠 Customer Marker */}
        <Marker
          position={{ lat: 27.7210, lng: 85.3310 }}
          label="C"
        />

        {/* 🔵 Route Line */}
        <Polyline
          path={routePath}
          options={{
            strokeColor: "#007bff",
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;