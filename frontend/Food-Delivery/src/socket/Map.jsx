import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { socket } from "./socket.js";
function Map() {
  const [riderLocation, setRiderLocation] = useState({
    lat: 27.7172,
    lng: 85.324,
  });
  
  useEffect(() => {
    socket.on("rider_location_update", (data) => {
      setRiderLocation({
        lat: data.lat,
        lng: data.lng,
      });
    });
    return () => {
      socket.off("rider_location_update");
    };
  }, []);
  const containerStyle = {
    width: "100%",
    height: "500px",
  };
  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyCNx-jLKHwMxicLIipHR3z9fs-KcAvLFkU">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={riderLocation}
          zoom={15}
         
        >
          {/* Rider marker */}
          <Marker position={riderLocation}/>
        
          
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default Map;
