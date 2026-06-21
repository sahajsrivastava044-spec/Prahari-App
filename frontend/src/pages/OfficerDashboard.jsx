import { useEffect, useState, useCallback, useMemo } from "react";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import API from "../services/api";
import {getDistance} from "geolib"
import LocalRiskMap from "../components/LocalRiskMap";

const OfficerDashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  useEffect(() => {
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    },
    (error) => {
      console.log("Location Error:", error);
    }
  );
}, []);
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
  // const latestRisk=incidents.length>0 ? incidents[incidents.length-1].riskLevel : "LOW";

useEffect(() => {
  const fetchSummary = async () => {
    try {
      if (incidents.length === 0) return;

      // Prefer summarizing a HIGH risk area
      const highRiskIncident = incidents.find(
        (incident) => incident.riskLevel === "HIGH"
      );

      const village =
        highRiskIncident?.village ||
        incidents[0].village;

      const res = await API.get(
        `/incidents/summary/${village}`
      );

      setSummary(res.data.summary);
    } catch (error) {
      console.log("Summary Error:", error);
    }
  };

  fetchSummary();
}, [incidents]);

  const fetchIncidents = useCallback(async () => {
    try {
      const res = await API.get("/incidents/get");
      setIncidents(res.data.incidents);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadIncidents = async () => {
      await fetchIncidents();
    };

    loadIncidents();
  }, [fetchIncidents]);

  const verifyIncident = async (id) => {
    try {
      await API.patch(`/incidents/${id}/verify`);
      fetchIncidents();
    } catch (error) {
      console.log(error);
    }
  };

  const resolveIncident = async (id) => {
    try {
      await API.patch(`/incidents/${id}/resolve`);
      fetchIncidents();
    } catch (error) {
      console.log(error);
    }
  };

  const pendingCount = incidents.filter(
    (incident) => incident.status === "pending"
  ).length;

  const highRiskCount = incidents.filter(
    (incident) => incident.riskLevel === "HIGH"
  ).length;

  if (loading) return <h1 className="p-10">Loading...</h1>;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-green-50 p-6">

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-green-900">
            Wildlife Intelligence Center
          </h1>

          <p className="text-gray-600 mt-2 text-lg">
            Real-time situational awareness for forest authorities.
          </p>
        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <DashboardCard
            title="Total Incidents"
            value={incidents.length}
          />

          <DashboardCard
            title="High Risk Zones"
            value={highRiskCount}
          />

          <DashboardCard
            title="Pending Verifications"
            value={pendingCount}
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

    <div
  className="
  bg-gradient-to-r
  from-green-800
  via-emerald-700
  to-green-600
  text-white
  p-8
  rounded-3xl
  shadow-2xl
  mb-8
"
>
  <div className="flex items-center gap-4 mb-5">
    <div className="text-5xl">🧠</div>

    <div>
      <h2 className="text-3xl font-bold">
        AI Wildlife Intelligence Summary
      </h2>

      <p className="text-green-100">
        Generated using Gemini AI
      </p>
    </div>
  </div>

  <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
    <p className="text-lg leading-8">
      {summary ||
        "Analyzing recent wildlife activity and generating intelligence report..."}
    </p>
  </div>
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

        <div className="bg-gradient-to-r from-green-700 to-emerald-600
                text-white p-8 rounded-2xl shadow-xl mb-8">

            <div className="flex items-center gap-3 mb-4">

                <div className="text-4xl">
                    ✨
                </div>

                <div>
                    <h2 className="text-2xl font-bold">
                        AI Wildlife Intelligence Summary
                    </h2>

                    <p className="text-green-100">
                        Generated using Gemini AI
                    </p>
                </div>

            </div>

            <p className="text-lg leading-relaxed">
                {summary ||
                  "Generating wildlife intelligence summary..."}
            </p>

        </div>

        {/* Incident Table */}

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            Incident Management
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Type</th>
                  <th className="text-left py-3">Village</th>
                  <th className="text-left py-3">Risk</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {incidents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-gray-500"
                    >
                      No incidents reported yet.
                    </td>
                  </tr>
                ) : (
                  incidents.map((incident) => (
                    <tr
                      key={incident._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3">
                        {incident.incidentType}
                      </td>

                      <td className="py-3">
                        {incident.village}
                      </td>

                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm font-semibold
                            ${
                              incident.riskLevel === "HIGH"
                                ? "bg-red-600"
                                : incident.riskLevel === "MEDIUM"
                                ? "bg-yellow-500"
                                : "bg-green-600"
                            }`}
                        >
                          {incident.riskLevel}
                        </span>
                      </td>

                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm font-semibold
                            ${
                              incident.status === "resolved"
                                ? "bg-green-600"
                                : incident.status === "verified"
                                ? "bg-blue-600"
                                : "bg-orange-500"
                            }`}
                        >
                          {incident.status}
                        </span>
                      </td>

                      <td className="py-3 space-x-2">
                        {incident.status === "pending" && (
                          <button
                            onClick={() =>
                              verifyIncident(incident._id)
                            }
                            className="
                              bg-blue-600
                              hover:bg-blue-700
                              text-white
                              px-4
                              py-2
                              rounded-lg
                            "
                          >
                            Verify
                          </button>
                        )}

                        {incident.status !== "resolved" && (
                          <button
                            onClick={() =>
                              resolveIncident(incident._id)
                            }
                            className="
                              bg-green-600
                              hover:bg-green-700
                              text-white
                              px-4
                              py-2
                              rounded-lg
                            "
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>

          </div>

        </div>

      </div>
    </>
  );
};

export default OfficerDashboard;