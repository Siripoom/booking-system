import { useEffect, useState } from "react";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getActivities,
} from "../../services/apiService";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({
    activityId: "",
    name: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadRooms();
    loadActivities();
  }, []);

  const loadRooms = async () => {
    const response = await getRooms();
    setRooms(response.data);
  };

  const loadActivities = async () => {
    const response = await getActivities();
    setActivities(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateRoom(editingId, formData);
      setEditingId(null);
    } else {
      await createRoom(formData);
    }
    setFormData({ activityId: "", name: "" });
    loadRooms();
  };

  const handleEdit = (room) => {
    setFormData({
      activityId: room.activityId,
      name: room.name,
    });
    setEditingId(room.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteRoom(id);
      loadRooms();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Manage Rooms</h2>

      {/* ฟอร์มเพิ่ม/แก้ไขห้อง */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mt-4">
        <select
          className="select select-bordered"
          value={formData.activityId}
          onChange={(e) =>
            setFormData({ ...formData, activityId: e.target.value })
          }
          required
        >
          <option value="">Select Activity</option>
          {activities.map((activity) => (
            <option key={activity.id} value={activity.id}>
              {activity.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Room Name"
          className="input input-bordered"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <button type="submit" className="btn btn-primary">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* ตารางแสดงข้อมูลห้อง */}
      <table className="table w-full mt-4">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Room Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.activity?.name}</td>
              <td>{room.name}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm mx-1"
                  onClick={() => handleEdit(room)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => handleDelete(room.id)}
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

export default ManageRooms;
