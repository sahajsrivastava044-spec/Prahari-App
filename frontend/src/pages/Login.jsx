import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!phone || !password) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);
    try {
      const res = await API.post("/user/login", {
        phone,
        password,
      });

      login(res.data.user, res.data.token);
      toast.success("Welcome back!");

      if (res.data.user.role === "officer") {
        navigate("/officer-dashboard");
      } else {
        navigate("/community-dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50/50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-green-100">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Prahari Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h1 className="text-3xl font-extrabold text-green-900">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">Sign in to your PRAHARI account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
            <input
              type="text"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white p-3.5 rounded-xl font-bold shadow-md transition-colors disabled:opacity-70 mt-4"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-700 font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}