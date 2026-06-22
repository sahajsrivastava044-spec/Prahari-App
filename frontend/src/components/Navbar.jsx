import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const role = user?.role;

  const getLinkClass = (path) => {
    return location.pathname === path 
      ? "text-yellow-300 font-semibold border-b-2 border-yellow-300 pb-1 transition-all"
      : "hover:text-green-200 transition-colors py-1";
  };

  return (
    <nav className="bg-green-800 text-white shadow-md relative z-50">
      <div className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="font-bold text-2xl flex items-center gap-3">
          <img src="/logo.png" alt="Prahari Logo" className="w-10 h-10 object-contain" />
          <span className="tracking-wide">PRAHARI</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center font-medium">
          {role === "community" && (
            <>
              <Link to="/community-dashboard" className={getLinkClass("/community-dashboard")}>Dashboard</Link>
              <Link to="/report" className={getLinkClass("/report")}>Report</Link>
              <Link to="/risk-map" className={getLinkClass("/risk-map")}>Risk Map</Link>
              <Link to="/alerts" className={getLinkClass("/alerts")}>Alerts</Link>
            </>
          )}

          {role === "officer" && (
            <>
              <Link to="/officer-dashboard" className={getLinkClass("/officer-dashboard")}>Dashboard</Link>
              <Link to="/risk-map" className={getLinkClass("/risk-map")}>Risk Map</Link>
              <Link to="/alerts" className={getLinkClass("/alerts")}>Alerts</Link>
            </>
          )}

          {role && (
            <button 
              onClick={logout} 
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded-lg ml-2 text-sm font-semibold shadow-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-green-100 hover:text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-green-900 border-t border-green-700/50 absolute w-full left-0 shadow-xl pb-4">
          <div className="flex flex-col gap-4 p-6 font-medium text-lg">
            {role === "community" && (
              <>
                <Link to="/community-dashboard" onClick={() => setIsOpen(false)} className={getLinkClass("/community-dashboard")}>Dashboard</Link>
                <Link to="/report" onClick={() => setIsOpen(false)} className={getLinkClass("/report")}>Report</Link>
                <Link to="/risk-map" onClick={() => setIsOpen(false)} className={getLinkClass("/risk-map")}>Risk Map</Link>
                <Link to="/alerts" onClick={() => setIsOpen(false)} className={getLinkClass("/alerts")}>Alerts</Link>
              </>
            )}

            {role === "officer" && (
              <>
                <Link to="/officer-dashboard" onClick={() => setIsOpen(false)} className={getLinkClass("/officer-dashboard")}>Dashboard</Link>
                <Link to="/risk-map" onClick={() => setIsOpen(false)} className={getLinkClass("/risk-map")}>Risk Map</Link>
                <Link to="/alerts" onClick={() => setIsOpen(false)} className={getLinkClass("/alerts")}>Alerts</Link>
              </>
            )}

            {role && (
              <button 
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }} 
                className="flex justify-center items-center gap-2 bg-red-600 active:bg-red-700 px-4 py-3 rounded-xl mt-2 font-bold shadow"
              >
                <LogOut size={20} /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}