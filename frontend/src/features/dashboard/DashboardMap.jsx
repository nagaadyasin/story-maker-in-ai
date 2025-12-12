import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { dripStore } from "../../store/dripStore";
import { useEffect, useState } from "react";
import L from "leaflet";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Icons
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const goldIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function DashboardMap() {
  const [villages, setVillages] = useState(() => dripStore.getVillages());

  useEffect(() => {
    // Listen for updates
    const handleUpdate = () => setVillages(dripStore.getVillages());
    dripStore.addEventListener("change", handleUpdate);
    return () => dripStore.removeEventListener("change", handleUpdate);
  }, []);

  // Center map on Somalia
  const center = [2.0, 42.5];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden glass-panel border shadow-lg z-0">
      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {villages.map((village) => {
          // Determine icon color based on vulnerability or water status
          let icon = greenIcon;
          if (village.waterAccessLevel === "Critical") icon = redIcon;
          else if (village.waterAccessLevel === "Low") icon = goldIcon;

          // Generate deterministic mock coordinates based on village ID characters
          // Use _id (MongoDB) or fall back to id (legacy)
          const validId = village._id || village.id || "default";
          const idSum = validId
            .toString()
            .split("")
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const mockLat = center[0] + ((idSum % 100) / 100 - 0.5) * 4;
          const mockLng = center[1] + ((idSum % 73) / 73 - 0.5) * 4;

          return (
            <Marker key={validId} position={[mockLat, mockLng]} icon={icon}>
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold">{village.name}</h3>
                  <p className="text-sm">Status: {village.waterAccessLevel}</p>
                  <p className="text-sm">
                    Vuln Score: {village.vulnerabilityScore}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
