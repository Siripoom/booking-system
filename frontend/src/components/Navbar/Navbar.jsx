import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ดึงข้อมูล username จาก localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setUsername(localStorage.getItem("username"));
    };

    // ฟัง event เมื่อ localStorage เปลี่ยนแปลง
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    setUsername(null); // รีเซ็ต state
    navigate("/auth/login");
  };

  return (
    <div className="navbar bg-green-500">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Booking System
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {username ? (
            <>
              <li>
                <span className="font-bold">{username}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-error btn-sm">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/auth/login">Log-in</Link>
              </li>
              <li>
                <Link to="/auth/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
