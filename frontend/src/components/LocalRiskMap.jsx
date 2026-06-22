import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { Loader2 } from "lucide-react";

// Hook to automatically invalidate size when container dimensions change
const MapResizeHandler = () => {
  const map = useMap();
  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener("resize", handleResize);
    // Initial invalidate after a short delay to ensure container is fully rendered
    setTimeout(() => map.invalidateSize(), 100);
    return () => window.removeEventListener("resize", handleResize);
  }, [map]);
  return null;
};

const getRiskColor = (risk) => {
  switch (risk?.toUpperCase()) {
    case "HIGH":
      return "red";
    case "MEDIUM":
      return "orange";
    default:
      return "green";
  }
};

const LocalRiskMap = ({
  userLocation,
  incidents,
  areaRisk,
}) => {
  if (!userLocation) {
    return (
      <div className="h-[350px] w-full rounded-2xl bg-gray-50 flex flex-col items-center justify-center border border-gray-100">
        <Loader2 className="animate-spin text-green-600 mb-2" size={32} />
        <p className="text-gray-500 font-medium">Fetching secure GPS connection...</p>
      </div>
    );
  }

  return (
    <div className="relative h-[350px] w-full rounded-2xl overflow-hidden shadow-inner border border-gray-200">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <MapResizeHandler />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location */}
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>
            <div className="text-center">
              <strong>Your Active Location</strong>
              <p className="text-sm text-gray-500 mt-1">Monitoring radius: 5km</p>
            </div>
          </Popup>
        </Marker>

        {/* Nearby Risk Radius */}
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={5000}
          pathOptions={{
            color: getRiskColor(areaRisk),
            fillOpacity: 0.15,
            weight: 2,
          }}
        />

        {/* Nearby Incidents */}
        {incidents.map((incident) => (
          <Marker
            key={incident._id}
            position={[incident.location.lat, incident.location.lng]}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-gray-900 border-b pb-1 mb-2">
                  {incident.incidentType.replace('_', ' ').toUpperCase()}
                </h3>
                <p className="text-sm text-gray-700 mb-2">{incident.description}</p>
                <div className="space-y-1 text-xs">
                  <p><strong>Village:</strong> {incident.village}</p>
                  <p>
                    <strong>Risk Level:</strong>{" "}
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      incident.riskLevel === "HIGH" ? "bg-red-100 text-red-800" :
                      incident.riskLevel === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {incident.riskLevel}
                    </span>
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LocalRiskMap;