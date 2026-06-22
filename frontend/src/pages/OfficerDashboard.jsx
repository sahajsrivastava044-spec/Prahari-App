import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import API from "../services/api";
import { getDistance } from "geolib";
import LocalRiskMap from "../components/LocalRiskMap";
import { Loader2, MapPin, BrainCircuit, ShieldCheck } from "lucide-react";

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
        { latitude: userLocation.lat, longitude: userLocation.lng },
        { latitude: incident.location.lat, longitude: incident.location.lng }
      );
      return distance <= 10000;
    });
  }, [userLocation, incidents]);

  const activeNearbyIncidents = useMemo(() => {
    return nearbyIncidents.filter(inc => inc.status !== 'resolved');
  }, [nearbyIncidents]);

  const areaRisk = useMemo(() => {
    if (activeNearbyIncidents.length === 0) return "LOW";
    if (activeNearbyIncidents.some((incident) => incident.riskLevel === "HIGH")) return "HIGH";
    if (activeNearbyIncidents.some((incident) => incident.riskLevel === "MEDIUM")) return "MEDIUM";
    return "LOW";
  }, [activeNearbyIncidents]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        if (incidents.length === 0) return;

        // Prefer summarizing a HIGH risk area
        const highRiskIncident = incidents.find(
          (incident) => incident.riskLevel === "HIGH"
        );

        const village = highRiskIncident?.village || incidents[0].village;

        const res = await API.get(`/incidents/summary/${village}`);
        setSummary(res.data.summary);
      } catch (error) {
        console.log("Summary Error:", error);
      }
    };

    fetchSummary();
  }, [incidents]);

  const alertsCount = useRef(0);

  const fetchIncidents = useCallback(async () => {
    try {
      const res = await API.get("/incidents/get");
      setIncidents(res.data.incidents);

      // Check for alerts for popup
      const alertRes = await API.get("/alerts");
      const fetchedAlerts = alertRes.data.alerts;
      if (alertsCount.current > 0 && fetchedAlerts.length > alertsCount.current) {
        toast.error(`🚨 NEW ALERT: ${fetchedAlerts[0]?.title || 'Wildlife incident reported!'}`, {
          duration: 8000,
          style: { background: '#ef4444', color: '#fff', fontWeight: 'bold' }
        });
      }
      alertsCount.current = fetchedAlerts.length;

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-green-700" size={48} />
        <h1 className="mt-4 text-xl font-semibold text-green-900">Loading Intelligence Center...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50/50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Wildlife Intelligence Center
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Real-time situational awareness for forest authorities.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <DashboardCard title="Total Incidents" value={incidents.length} />
          <DashboardCard title="High Risk Zones" value={highRiskCount} />
          <DashboardCard title="Pending Verifications" value={pendingCount} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="text-green-700" size={24} /> My Area Risk Status
              </h2>
              <p className="text-gray-500 mt-1">
                Real-time wildlife activity around your location.
              </p>
            </div>
            <span
              className={`mt-4 md:mt-0 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border ${
                areaRisk === "HIGH"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : areaRisk === "MEDIUM"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-green-50 text-green-700 border-green-200"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-green-50/50 border border-green-100 rounded-xl p-6 flex flex-col justify-center items-center text-center">
              <h3 className="font-semibold text-green-900 flex items-center gap-2 mb-2">
                <MapPin size={18} /> Nearby Incidents
              </h3>
              <p className="text-5xl font-black text-green-800 my-2">{nearbyIncidents.length}</p>
              <p className="text-sm text-green-700">within 10 km radius</p>
            </div>

            <div className="bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white p-6 rounded-2xl shadow-lg lg:col-span-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                <BrainCircuit size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <BrainCircuit size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AI Wildlife Intelligence Summary</h2>
                    <p className="text-green-100 text-sm">Powered by Gemini 2.0</p>
                  </div>
                </div>
                <div className="bg-black/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm leading-relaxed text-green-50">
                    {summary || "Analyzing recent wildlife activity and generating intelligence report. Please wait..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Incident Table */}
        <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-green-600" size={24} /> Incident Management
          </h2>

          <div className="overflow-x-auto">
            {nearbyIncidents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                <ShieldCheck className="mx-auto text-green-400 mb-3" size={40} />
                <p className="text-gray-500 font-medium">No incidents reported yet. Area is clear.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tl-lg">Type</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Village</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {nearbyIncidents.map((incident) => (
                    <tr key={incident._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 text-sm font-medium text-gray-900 capitalize">{incident.incidentType.replace('_', ' ')}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{incident.village}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          incident.riskLevel === "HIGH" ? "bg-red-100 text-red-700" :
                          incident.riskLevel === "MEDIUM" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {incident.riskLevel}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          incident.status === "resolved" ? "bg-green-100 text-green-700" :
                          incident.status === "verified" ? "bg-blue-100 text-blue-700" :
                          "bg-orange-100 text-orange-700"
                        }`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 space-x-2">
                        {incident.status === "pending" && (
                          <button
                            onClick={() => verifyIncident(incident._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                          >
                            Verify
                          </button>
                        )}
                        {incident.status !== "resolved" && (
                          <button
                            onClick={() => resolveIncident(incident._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;