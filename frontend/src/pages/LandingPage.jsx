import { Link } from "react-router-dom";
import { MapPin, AlertTriangle, Map, BrainCircuit } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white selection:bg-green-300 selection:text-green-900">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Prahari Logo" className="w-12 h-12 object-contain" />
          <h1 className="text-3xl font-extrabold tracking-tight hidden sm:block">
            PRAHARI
          </h1>
        </Link>

        <div className="space-x-4">
          <Link
            to="/login"
            className="text-green-50 hover:text-white px-5 py-2 font-semibold transition-colors"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-white text-green-700 hover:bg-green-50 px-6 py-2.5 rounded-full font-bold shadow-sm transition-all"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Left */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-green-50 font-medium text-sm">
            <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
            Live Early Warning System
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Community-Driven Early Warning for
            Human-Wildlife Conflict
          </h1>

          <p className="text-lg lg:text-xl text-green-100/90 leading-relaxed max-w-lg">
            PRAHARI empowers communities and forest
            officers with real-time wildlife incident
            reporting, hotspot detection, and risk
            alerts.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/signup"
              className="bg-white hover:bg-green-50 text-green-700 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
            </Link>

            <Link
              to="/risk-map"
              className="border-2 border-white/40 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold transition-all"
            >
              View Risk Map
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 lg:p-10 shadow-2xl border border-white/20 relative">
          
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 opacity-90" />
            Why PRAHARI?
          </h2>

          <div className="space-y-6">

            <div className="flex gap-4 items-start">
              <div className="bg-white/20 p-3 rounded-xl">
                <MapPin className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Real-Time Incident Reporting</h3>
                <p className="text-green-100/80 mt-1">Community members can instantly report tiger sightings and conflict incidents.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-white/20 p-3 rounded-xl">
                <AlertTriangle className="text-yellow-300" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Automated Risk Alerts</h3>
                <p className="text-green-100/80 mt-1">PRAHARI automatically detects emerging conflict hotspots.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-white/20 p-3 rounded-xl">
                <Map className="text-blue-300" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Live Risk Map</h3>
                <p className="text-green-100/80 mt-1">Forest officers gain situational awareness through interactive maps.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-white/20 p-3 rounded-xl">
                <BrainCircuit className="text-purple-300" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-xl">AI-Assisted Intelligence</h3>
                <p className="text-green-100/80 mt-1">Summarized reports help authorities respond faster.</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-green-200/80 font-medium border-t border-green-600/30 mt-8">
        Built for Wildlife Conservation Hackathon 2026
      </footer>

    </div>
  );
};

export default LandingPage;