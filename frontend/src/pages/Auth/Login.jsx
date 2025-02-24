import { useState } from "react";
import { loginUser } from "../../services/apiService";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.user.fullName);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("userId", response.data.user.id);

      // แจ้ง Navbar ให้รับรู้การเปลี่ยนแปลงของ localStorage
      window.dispatchEvent(new Event("storage"));

      alert("Login successful!");

      // ส่งผู้ใช้ไปหน้าหลักถ้าเป็น USER แต่ถ้าเป็น ADMIN ส่งไปหน้าจัดการการจอง
      if (response.data.user.role === "ADMIN") {
        navigate("/admin");
      }
      navigate("/");
    } catch (error) {
      alert("Error: " + error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-96 bg-white shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="mt-4">
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
            className="input input-bordered w-full mb-4"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-2">
          Don&apos;t have an account?{" "}
          <Link to="/auth/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
