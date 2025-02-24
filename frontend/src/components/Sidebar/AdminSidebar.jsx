import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function AdminSidebar({ setSelectedTab }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("token");

    navigate("/auth/login");
  };
  return (
    <div className="w-64 bg-white shadow-md min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <ul className="menu">
        <li>
          <button
            className="btn btn-ghost"
            onClick={() => setSelectedTab("users")}
          >
            Manage Users
          </button>
        </li>
        <li>
          <button
            className="btn btn-ghost"
            onClick={() => setSelectedTab("activities")}
          >
            Manage Activities
          </button>
        </li>
        <li>
          <button
            className="btn btn-ghost"
            onClick={() => setSelectedTab("places")}
          >
            Manage Places
          </button>
        </li>
        <li>
          <button
            className="btn btn-ghost"
            onClick={() => setSelectedTab("rooms")}
          >
            Manage Rooms
          </button>
        </li>
        <li>
          <button
            className="btn btn-ghost"
            onClick={() => setSelectedTab("bookings")}
          >
            Manage Bookings
          </button>
        </li>
        <li>
          <button className="btn btn-ghost" onClick={() => handleLogout()}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
