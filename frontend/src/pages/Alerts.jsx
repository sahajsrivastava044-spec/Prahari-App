import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
    try {
      const res = await API.get("/alerts");
      setAlerts(res.data.alerts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
    fetchAlerts();
  }, []);

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700";

      case "medium":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-green-100 text-green-700";
    }
  };

  if (loading) {
    return <h1 className="p-10">Loading Alerts...</h1>;
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-green-50 p-6">
        <h1 className="text-3xl font-bold mb-8">
          🚨 Wildlife Alerts
        </h1>

        {alerts.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <h2 className="text-xl font-semibold">
              No Active Alerts
            </h2>

            <p className="text-gray-500 mt-2">
              The region is currently safe.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className="bg-white rounded-xl shadow p-6 border-l-8 border-red-500"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {alert.title}
                  </h2>

                  <span
                    className={`px-4 py-2 rounded-full font-semibold ${getRiskColor(
                      alert.riskLevel
                    )}`}
                  >
                    {alert.riskLevel}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">
                  {alert.message}
                </p>

                <div className="text-sm text-gray-500">
                  <p>
                    <strong>Affected Area:</strong>{" "}
                    {alert.affectedArea}
                  </p>

                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(
                      alert.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Alerts;