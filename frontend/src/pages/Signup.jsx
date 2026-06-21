import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      newErrors.name =
        "Name must be at least 3 characters";
    }

    // Phone Validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone =
        "Phone number must contain exactly 10 digits";
    }

    // Village Validation
    if (!formData.village.trim()) {
      newErrors.village = "Village is required";
    } else if (formData.village.trim().length < 2) {
      newErrors.village =
        "Village name is too short";
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    // Role Validation
    if (
      !["community", "officer"].includes(
        formData.role
      )
    ) {
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

      alert("Account created successfully");

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Sign Up
        </h1>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-1"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-3">
            {errors.name}
          </p>
        )}

        <input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-1"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mb-3">
            {errors.phone}
          </p>
        )}

        <input
          name="village"
          placeholder="Village"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-1"
        />
        {errors.village && (
          <p className="text-red-500 text-sm mb-3">
            {errors.village}
          </p>
        )}

        <select
          name="role"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-1"
        >
          <option value="community">
            Community User
          </option>

          <option value="officer">
            Forest Officer
          </option>
        </select>

        {errors.role && (
          <p className="text-red-500 text-sm mb-3">
            {errors.role}
          </p>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-1"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-4">
            {errors.password}
          </p>
        )}

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded disabled:opacity-50">
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}