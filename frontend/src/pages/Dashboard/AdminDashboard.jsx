import { useState } from "react";
import AdminSidebar from "../../components/Sidebar/AdminSidebar.jsx";
import ManageUsers from "./ManageUsers";
import ManageActivities from "./ManageActivities";
import ManagePlaces from "./ManagePlaces.jsx";
import ManageRooms from "./ManageRooms.jsx";
import ManageBookings from "./ManageBookings";

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("users");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar setSelectedTab={setSelectedTab} />

      <div className="flex-1 p-6">
        {selectedTab === "users" && <ManageUsers />}
        {selectedTab === "activities" && <ManageActivities />}
        {selectedTab === "places" && <ManagePlaces />}
        {selectedTab === "rooms" && <ManageRooms />}
        {selectedTab === "bookings" && <ManageBookings />}
      </div>
    </div>
  );
};

export default AdminDashboard;
