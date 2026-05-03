import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { homeIcon,bikeIcon, resturantIcon} from "./MapIcon";

export default function Map({
  riderPosition,
  route,
  restaurantPosition,
  homePosition,
}) {
    if (
  !riderPosition ||
  riderPosition.length !== 2 ||
  isNaN(riderPosition[0]) ||
  isNaN(riderPosition[1])
) {
  return <div>Loading map...</div>;
}
  return (
    <MapContainer
      center={riderPosition}
      zoom={15}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      {/* Base Map */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* 🚴 Rider Marker */}
      <Marker position={riderPosition} icon={bikeIcon}>
        <Popup>Rider is here 🚴</Popup>
      </Marker>

      {/* 🍔 Restaurant Marker (Start) */}
      <Marker position={restaurantPosition} icon={resturantIcon}>
        <Popup>Restaurant 🍔</Popup>
      </Marker>

      {/* 🏠 Home Marker (Destination) */}
      <Marker position={homePosition} icon={homeIcon}>
        <Popup>Delivery Location 🏠</Popup>
      </Marker>

      {/* 🛣 Route Line */}
      {route.length > 0 && (
        <Polyline
          positions={route}
          color="blue"
          weight={4}
          opacity={0.7}
          dashArray="10, 10"
        />
      )}
    </MapContainer>
  );
}












