import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const role = user?.role;

return (
  <nav className="bg-green-800 text-white px-8 py-4 flex justify-between">

    <Link to="/" className="font-bold text-2xl">
      🐯 PRAHARI
    </Link>

    <div className="flex gap-6 items-center">

      {role === "community" && (
        <>
          <Link to="/community-dashboard">Dashboard</Link>
          <Link to="/report">Report</Link>
          <Link to="/risk-map">Risk Map</Link>
          <Link to="/alerts">Alerts</Link>
        </>
      )}

      {role === "officer" && (
        <>
          <Link to="/officer-dashboard">Dashboard</Link>
          <Link to="/risk-map">Risk Map</Link>
          <Link to="/alerts">Alerts</Link>
        </>
      )}

      <button onClick={logout} className="border rounded bg-red-500 p-2 border-round">
        Logout
      </button>

    </div>
  </nav>
);
}