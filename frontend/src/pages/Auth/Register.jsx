import { useState } from "react";
import { registerUser } from "../../services/apiService";
import { Link, useNavigate } from "react-router-dom";
import bg from "../../assets/bg2.webp";
import Swal from "sweetalert2";
const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "USER",
    phoneNumber: "",
    citizenId: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("formData", formData);
      await registerUser(formData);
      // alert("Registration successful!");
      Swal.fire({
        title: "Registration successful!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/auth/login");
    } catch (error) {
      alert("Error: " + error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="card w-96 bg-white shadow-xl p-6"
        style={{
          opacity: "0.95",
        }}
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="input input-bordered w-full mb-2"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="citizenId"
            placeholder="Citizen ID"
            className="input input-bordered w-full mb-2"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-full mb-2"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered w-full mb-2"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="input input-bordered w-full mb-2"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            className="input input-bordered w-full mb-2"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center mt-2">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
