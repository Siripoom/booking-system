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
    <div className="navbar bg-green-900">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-4xl" style={{color:"#fff"}}>
          Booking System
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {username ? (
            <>
              <li>
                <span className="font-bold" style={{color:"#fff"}}>{username}</span>
              </li>
              <li>
                <button onClick={handleLogout} style={{color:"#fff"}} className="btn btn-error btn-sm">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/auth/login" style={{color:"#fff"}}>Log-in</Link>
              </li>
              <li>
                <Link to="/auth/register" style={{color:"#fff"}}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
