import { useEffect, useMemo, useState, useRef } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import API from "../services/api";
import DashboardCard from "../components/DashboardCard";
import { Link } from "react-router-dom";
import { getDistance } from "geolib";
import LocalRiskMap from "../components/LocalRiskMap";
import { Loader2, Plus, AlertCircle, ShieldCheck, MapPin } from "lucide-react";

export default function CommunityDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const alertsCount = useRef(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const incidentRes = await API.get("/incidents/get");
        const alertRes = await API.get("/alerts");

        setIncidents(incidentRes.data.incidents);
        
        const fetchedAlerts = alertRes.data.alerts;
        if (alertsCount.current > 0 && fetchedAlerts.length > alertsCount.current) {
          toast.error(`🚨 NEW ALERT: ${fetchedAlerts[0]?.title || 'Wildlife incident reported!'}`, {
            duration: 8000,
            style: { background: '#ef4444', color: '#fff', fontWeight: 'bold' }
          });
        }
        alertsCount.current = fetchedAlerts.length;
        setAlerts(fetchedAlerts);
        
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const nearbyIncidents = useMemo(() => {
    if (!userLocation || incidents.length === 0) return [];

    return incidents.filter((incident) => {
      if (incident.status === "resolved") return false; // Hide resolved from community
      const distance = getDistance(
        { latitude: userLocation.lat, longitude: userLocation.lng },
        { latitude: incident.location.lat, longitude: incident.location.lng }
      );
      return distance <= 10000;
    });
  }, [userLocation, incidents]);

  const areaRisk = useMemo(() => {
    if (nearbyIncidents.length === 0) return "LOW";
    if (nearbyIncidents.some((incident) => incident.riskLevel === "HIGH")) return "HIGH";
    if (nearbyIncidents.some((incident) => incident.riskLevel === "MEDIUM")) return "MEDIUM";
    return "LOW";
  }, [nearbyIncidents]);

  const latestRisk = incidents.length > 0 ? incidents[incidents.length - 1].riskLevel : "LOW";

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-green-700" size={48} />
        <h1 className="mt-4 text-xl font-semibold text-green-900">Loading Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50/50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Community Dashboard
          </h1>
          <Link to="/report" className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all">
            <Plus size={20} /> Report New Incident
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard title="Total Reports" value={incidents.length} />
          <DashboardCard title="Current Risk Level" value={latestRisk} />
          <DashboardCard title="Active Alerts" value={alerts.length} />
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

          <LocalRiskMap userLocation={userLocation} incidents={nearbyIncidents} areaRisk={areaRisk} />

          {/* Region Intelligence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-green-50/50 border border-green-100 rounded-xl p-5">
              <h3 className="font-semibold text-green-900 flex items-center gap-2 mb-2">
                <MapPin size={18} /> Nearby Incidents
              </h3>
              <p className="text-4xl font-black text-green-800">{nearbyIncidents.length}</p>
              <p className="text-sm text-green-700 mt-1">within 10 km radius</p>
            </div>

            <div className={`${areaRisk === 'HIGH' ? 'bg-red-50 border-red-100 text-red-900' : areaRisk === 'MEDIUM' ? 'bg-yellow-50 border-yellow-100 text-yellow-900' : 'bg-blue-50 border-blue-100 text-blue-900'} border rounded-xl p-5`}>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <ShieldCheck size={18} /> Safety Advisory
              </h3>
              <p className="text-sm font-medium opacity-90 leading-relaxed">
                {areaRisk === "HIGH"
                  ? "Avoid isolated movement and immediately inform local forest authorities."
                  : areaRisk === "MEDIUM"
                  ? "Remain cautious during early morning and evening hours."
                  : "No significant wildlife threat detected nearby."}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-700 mb-2">Last Updated</h3>
              <p className="text-sm font-medium text-gray-900">
                {new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <AlertCircle className="text-orange-500" size={24} /> Recent Alerts
            </h2>
            {alerts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                <ShieldCheck className="mx-auto text-green-400 mb-3" size={40} />
                <p className="text-gray-500 font-medium">All clear! No recent alerts.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.slice(0, 4).map((alert) => (
                  <div key={alert._id} className="border border-gray-100 rounded-xl p-4 bg-orange-50/30">
                    <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <MapPin className="text-green-600" size={24} /> Recent Reports
            </h2>
            <div className="overflow-x-auto">
              {incidents.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                  <ShieldCheck className="mx-auto text-green-400 mb-3" size={40} />
                  <p className="text-gray-500 font-medium">No incidents reported yet.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tl-lg">Type</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Village</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {nearbyIncidents.slice(0, 5).map((incident) => (
                      <tr key={incident._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900 capitalize">{incident.incidentType.replace('_', ' ')}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{incident.village}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            incident.riskLevel === "HIGH" ? "bg-red-100 text-red-700" :
                            incident.riskLevel === "MEDIUM" ? "bg-yellow-100 text-yellow-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {incident.riskLevel}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            incident.status === "resolved" ? "bg-green-100 text-green-700" :
                            incident.status === "verified" ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {incident.status}
                          </span>
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
    </div>
  );
}