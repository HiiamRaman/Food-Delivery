import { MapContainer, TileLayer, Marker, useMap, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { bikeIcon, resturantIcon, homeIcon } from "./MapIcon";
import {socket} from '../socket/socket'

// Move map smoothly
function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [position]);

  return null;
}

function LiveMap() {
  const [position, setPosition] = useState([27.7172, 85.324]);
  const [route, setRoute] = useState([]);

  const startPoint = [27.7172, 85.324];
  const endPoint = [27.729, 85.339];

  useEffect(() => {
    socket.on("rider_location_update", (data) => {
      console.log("📍 Rider:", data);

      setPosition([data.lat, data.lng]);

      // optional: only for trail
      setRoute((prev) => [...prev, data]);
    });

    return () => socket.off("rider_location_update");
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: "500px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <RecenterMap position={position} />

        {/* Rider */}
        <Marker position={position} icon={bikeIcon} />

        {/* Start & End */}
        <Marker position={startPoint} icon={resturantIcon} />
        <Marker position={endPoint} icon={homeIcon} />

        {/* Route line */}
        <Polyline
          positions={route.map((p) => [p.lat, p.lng])}
          color="blue"
        />
      </MapContainer>
    </div>
  );
}

export default LiveMap;