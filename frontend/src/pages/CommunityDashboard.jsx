import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import DashboardCard from "../components/DashboardCard";
import { Link } from "react-router-dom";
import { getDistance } from "geolib";
import LocalRiskMap from "../components/LocalRiskMap";

export default function CommunityDashboard() {
  const [incidents,setIncidents]=useState([]);
  const [alerts, setAlerts]=useState([]);
  const [loading, setLoading]=useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);
  useEffect(()=>{
      const fetchDashboardData=async ()=>{
    try {
      const incidentRes=await API.get("/incidents/get");
      const alertRes=await API.get("/alerts");


      setIncidents(incidentRes.data.incidents);
      setAlerts(alertRes.data.alerts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
    fetchDashboardData();
  },[]);

  const nearbyIncidents = useMemo(() => {
    if (!userLocation || incidents.length === 0) return [];

    return incidents.filter((incident) => {
      const distance = getDistance(
        {
          latitude: userLocation.lat,
          longitude: userLocation.lng,
        },
        {
          latitude: incident.location.lat,
          longitude: incident.location.lng,
        }
      );

      return distance <= 10000;
    });
  }, [userLocation, incidents]);

  const areaRisk = useMemo(() => {
    if (nearbyIncidents.length === 0) return "LOW";

    if (
      nearbyIncidents.some(
        (incident) => incident.riskLevel === "HIGH"
      )
    ) {
      return "HIGH";
    }

    if (
      nearbyIncidents.some(
        (incident) => incident.riskLevel === "MEDIUM"
      )
    ) {
      return "MEDIUM";
    }

    return "LOW";
  }, [nearbyIncidents]);
  const latestRisk=incidents.length>0 ? incidents[incidents.length-1].riskLevel : "LOW";

  if(loading){
    return <h1 className="p-10">Loading...</h1>
  }
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-green-50 p-6">
        <h1 className="text-3xl font-bold mb-8">
          Community Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total reports"
            value={incidents.length}
          />
          <DashboardCard
            title="Current Risk Level"
            value={latestRisk}
          />
          <DashboardCard
            title="Alerts"
            value={alerts.length}
          />
        </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 mt-8">

          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">

            <div>
              <h2 className="text-3xl font-bold text-green-800">
                📍 My Area Risk Status
              </h2>

              <p className="text-gray-500 mt-2">
                Real-time wildlife activity around your location.
              </p>
            </div>

            <span
              className={`mt-4 md:mt-0 px-5 py-2 rounded-full text-white font-bold ${
                areaRisk === "HIGH"
                  ? "bg-red-600"
                  : areaRisk === "MEDIUM"
                  ? "bg-yellow-500"
                  : "bg-green-600"
              }`}
            >
              {areaRisk} RISK
            </span>

          </div>

          <LocalRiskMap
            userLocation={userLocation}
            incidents={nearbyIncidents}
            areaRisk={areaRisk}
          />

          {/* Region Intelligence */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

            <div className="bg-green-50 rounded-xl p-5">
              <h3 className="font-bold text-xl">
                Nearby Incidents
              </h3>

              <p className="text-4xl font-bold mt-2">
                {nearbyIncidents.length}
              </p>

              <p className="text-gray-500 mt-2">
                within 10 km radius
              </p>
            </div>

            <div className="bg-yellow-50 rounded-xl p-5">
              <h3 className="font-bold text-xl">
                Safety Advisory
              </h3>

              <p className="mt-3 text-gray-700">
                {areaRisk === "HIGH"
                  ? "Avoid isolated movement and immediately inform local forest authorities."
                  : areaRisk === "MEDIUM"
                  ? "Remain cautious during early morning and evening hours."
                  : "No significant wildlife threat detected nearby."}
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-5">
              <h3 className="font-bold text-xl">
                Last Updated
              </h3>

              <p className="mt-3 text-gray-700">
                {new Date().toLocaleString()}
              </p>
            </div>

          </div>

      </div>

        <Link to="/report" className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg mb-8">
          + Report New Incident
        </Link>
        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h2 className="text-xl font-semibold mb-4">
            Recent Alerts
          </h2>

          {alerts.length === 0 ? (
            <p>No alerts available.</p>
          ) : (
            alerts.slice(0, 3).map((alert) => (
              <div
                key={alert._id}
                className="border-b py-3"
              >
                <h3 className="font-semibold">
                  {alert.title}
                </h3>

                <p className="text-gray-600">
                  {alert.message}
                </p>
              </div>
            ))
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Recent Reports
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">
                    Type
                  </th>

                  <th className="text-left py-3">
                    Village
                  </th>

                  <th className="text-left py-3">
                    Risk
                  </th>

                  <th className="text-left py-3">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {incidents
                  .slice(0, 5)
                  .map((incident) => (
                    <tr
                      key={incident._id}
                      className="border-b"
                    >
                      <td className="py-3">
                        {incident.incidentType}
                      </td>

                      <td className="py-3">
                        {incident.village}
                      </td>

                      <td className="py-3">
                        {incident.riskLevel}
                      </td>

                      <td className="py-3">
                        {incident.status}
                      </td>
                    </tr>
                  ))}
              </tbody>

            </table>

          </div>
        </div>
      </div>
    </>
  );
}