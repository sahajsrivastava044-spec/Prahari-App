import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import RiskMap from "../components/RiskMap";

const RiskMapPage = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const fetchIncidents = async () => {
    try {
      const res = await API.get("/incidents/get");

      setIncidents(res.data.incidents);
    } catch (error) {
      console.log(error);
    }
  };
    fetchIncidents();
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-6 bg-green-50 min-h-screen">

        <h1 className="text-3xl font-bold mb-6">
          Wildlife Risk Map
        </h1>

        <div className="bg-white rounded-xl shadow p-4">
          <RiskMap incidents={incidents} />
        </div>

      </div>
    </>
  );
};

export default RiskMapPage;