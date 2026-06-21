import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";

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
      <div className="h-[350px] flex items-center justify-center">
        Fetching location...
      </div>
    );
  }

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={12}
      scrollWheelZoom={false}
      className="h-[350px] w-full rounded-xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User Location */}

      <Marker
        position={[
          userLocation.lat,
          userLocation.lng,
        ]}
      >
        <Popup>
          <strong>You are here</strong>
        </Popup>
      </Marker>

      {/* Nearby Risk Radius */}

      <Circle
        center={[
          userLocation.lat,
          userLocation.lng,
        ]}
        radius={5000}
        pathOptions={{
          color: getRiskColor(areaRisk),
          fillOpacity: 0.2,
        }}
      />

      {/* Nearby Incidents */}

      {incidents.map((incident) => (
        <Marker
          key={incident._id}
          position={[
            incident.location.lat,
            incident.location.lng,
          ]}
        >
          <Popup>
            <div>
              <h3 className="font-bold">
                {incident.incidentType}
              </h3>

              <p>{incident.description}</p>

              <p>
                <strong>Village:</strong>{" "}
                {incident.village}
              </p>

              <p>
                <strong>Risk:</strong>{" "}
                {incident.riskLevel}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LocalRiskMap;