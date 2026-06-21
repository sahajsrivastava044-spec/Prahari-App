import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white">

      {/* Navbar */}

      <nav className="flex justify-between items-center px-8 py-6">
        <h1 className="text-3xl font-bold">
          🐯 PRAHARI
        </h1>

        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-white text-green-700 px-5 py-2 rounded-lg font-semibold"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="border border-white px-5 py-2 rounded-lg"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}

      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">

        {/* Left */}

        <div>
          <h1 className="text-5xl font-extrabold leading-tight">
            Community-Driven Early Warning for
            Human-Wildlife Conflict
          </h1>

          <p className="mt-6 text-xl text-green-100">
            PRAHARI empowers communities and forest
            officers with real-time wildlife incident
            reporting, hotspot detection, and risk
            alerts.
          </p>

          <div className="mt-8 flex gap-4">

            <Link
              to="/signup"
              className="bg-white text-green-700 px-8 py-4 rounded-xl font-bold"
            >
              Get Started
            </Link>

            <Link
              to="/risk-map"
              className="border border-white px-8 py-4 rounded-xl"
            >
              View Risk Map
            </Link>

          </div>
        </div>

        {/* Right */}

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">

          <h2 className="text-2xl font-bold mb-6">
            Why PRAHARI?
          </h2>

          <div className="space-y-5">

            <div>
              <h3 className="font-semibold text-xl">
                📍 Real-Time Incident Reporting
              </h3>

              <p className="text-green-100">
                Community members can instantly
                report tiger sightings and conflict
                incidents.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-xl">
                🚨 Automated Risk Alerts
              </h3>

              <p className="text-green-100">
                PRAHARI automatically detects
                emerging conflict hotspots.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-xl">
                🗺️ Live Risk Map
              </h3>

              <p className="text-green-100">
                Forest officers gain situational
                awareness through interactive maps.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-xl">
                🤖 AI-Assisted Intelligence
              </h3>

              <p className="text-green-100">
                Summarized reports help authorities
                respond faster.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Footer */}

      <div className="text-center py-8 text-green-100">
        Built for Wildlife Conservation Hackathon 2026 🐅
      </div>

    </div>
  );
};

export default LandingPage;