import { useEffect, useState } from "react";
import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  getUsers,
  getRooms,
} from "../../services/apiService";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    roomId: "",
    bookingDate: "",
    status: "PENDING",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadBookings();
    loadUsers();
    loadRooms();
  }, []);

  const loadBookings = async () => {
    const response = await getBookings();
    setBookings(response.data);
  };

  const loadUsers = async () => {
    const response = await getUsers();
    setUsers(response.data);
  };

  const loadRooms = async () => {
    const response = await getRooms();
    setRooms(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateBooking(editingId, formData);
      setEditingId(null);
    } else {
      await createBooking(formData);
    }
    setFormData({ userId: "", roomId: "", bookingDate: "", status: "PENDING" });
    loadBookings();
  };

  const handleEdit = (booking) => {
    setFormData({
      userId: booking.userId,
      roomId: booking.roomId,
      bookingDate: booking.bookingDate.split("T")[0], // แปลง timestamp เป็นวันที่
      status: booking.status,
    });
    setEditingId(booking.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteBooking(id);
      loadBookings();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Manage Bookings</h2>

      {/* ฟอร์มเพิ่ม/แก้ไขการจอง */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mt-4">
        <select
          className="select select-bordered"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.fullName}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered"
          value={formData.roomId}
          onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
          required
        >
          <option value="">Select Room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="input input-bordered"
          value={formData.bookingDate}
          onChange={(e) =>
            setFormData({ ...formData, bookingDate: e.target.value })
          }
          required
        />
        <select
          className="select select-bordered"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="PENDING">PENDING</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="CANCELED">CANCELED</option>
        </select>
        <button type="submit" className="btn btn-primary">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* ตารางแสดงข้อมูลการจอง */}
      <table className="table w-full mt-4">
        <thead>
          <tr>
            <th>User</th>
            <th>Room</th>
            <th>Booking Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>
                {users.find((user) => user.id === booking.userId)?.fullName ||
                  "Unknown"}
              </td>
              <td>
                {rooms.find((room) => room.id === booking.roomId)?.name ||
                  "Unknown"}
              </td>
              <td>{booking.bookingDate.split("T")[0]}</td>
              <td>{booking.status}</td>
              <td className="border p-2">
                {booking.paymentSlip ? (
                  <a
                    href={`http://localhost:4000${booking.paymentSlip}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Slip
                  </a>
                ) : (
                  "No Slip"
                )}
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm mx-1"
                  onClick={() => handleEdit(booking)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => handleDelete(booking.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBookings;
