import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    village: "",
    role: "community",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must contain exactly 10 digits";
    }

    if (!formData.village.trim()) {
      newErrors.village = "Village is required";
    } else if (formData.village.trim().length < 2) {
      newErrors.village = "Village name is too short";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!["community", "officer"].includes(formData.role)) {
      newErrors.role = "Invalid role selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await API.post("/user/signup", formData);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50/50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-green-100 my-8">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Prahari Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h1 className="text-3xl font-extrabold text-green-900">
            Join Prahari
          </h1>
          <p className="text-gray-500 mt-2">Create an account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Full Name</label>
            <input
              name="name"
              placeholder="e.g. Ramesh Kumar"
              onChange={handleChange}
              className={`w-full border ${errors.name ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500'} bg-gray-50 p-3 rounded-xl outline-none transition-all focus:ring-2`}
            />
            {errors.name && <p className="text-red-500 text-xs font-medium pl-1">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
            <input
              name="phone"
              placeholder="e.g. 9876543210"
              onChange={handleChange}
              className={`w-full border ${errors.phone ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500'} bg-gray-50 p-3 rounded-xl outline-none transition-all focus:ring-2`}
            />
            {errors.phone && <p className="text-red-500 text-xs font-medium pl-1">{errors.phone}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Village</label>
            <input
              name="village"
              placeholder="e.g. Ramnagar"
              onChange={handleChange}
              className={`w-full border ${errors.village ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500'} bg-gray-50 p-3 rounded-xl outline-none transition-all focus:ring-2`}
            />
            {errors.village && <p className="text-red-500 text-xs font-medium pl-1">{errors.village}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Role</label>
            <select
              name="role"
              onChange={handleChange}
              className={`w-full border ${errors.role ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500'} bg-gray-50 p-3 rounded-xl outline-none transition-all focus:ring-2 appearance-none`}
            >
              <option value="community">Community User</option>
              <option value="officer">Forest Officer</option>
            </select>
            {errors.role && <p className="text-red-500 text-xs font-medium pl-1">{errors.role}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              className={`w-full border ${errors.password ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500'} bg-gray-50 p-3 rounded-xl outline-none transition-all focus:ring-2`}
            />
            {errors.password && <p className="text-red-500 text-xs font-medium pl-1">{errors.password}</p>}
          </div>

          <button
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white p-3.5 rounded-xl font-bold shadow-md transition-colors disabled:opacity-70 mt-6"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-green-700 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}