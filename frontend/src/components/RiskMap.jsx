import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";


const getCircleColor=(risk)=>{
    switch(risk){
        case "HIGH":
            return "red";
        case "MEDIUM":
            return "yellow";
        default:
            return "green";
    }
}

const RiskMap=({incidents})=>{
    return(
        <MapContainer center={[20.5937,78.9629]} // center of India
        zoom={5}
        style={{height:"600px", width:"100%"}}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {incidents.map((incident)=>(
                <div key={incident._id}>
                    <Marker position={[incident.location.lat,incident.location.lng]}>
                        <Popup>
                            <div>
                                <h3 className="font-bold">
                                    {incident.incidentType}
                                </h3>

                                <p>
                                    <strong>Village</strong>{" "}
                                    {incident.village}
                                </p>

                                <p>{incident.description}</p>

                                <p>
                                    <strong>Risk:</strong>{" "}
                                    {incident.status}
                                </p>
                            </div>
                        </Popup>
                    </Marker>

                    <Circle center={[incident.location.lat,incident.location.lng]}
                    radius = { 3000 }
                    pathOptions={{
                        color: getCircleColor(
                            incident.riskLevel
                        ),
                        fillOpacity:0.4,
                    }}
                    ></Circle>
                </div>
            ))}
        </MapContainer>
    )
}

export default RiskMap;