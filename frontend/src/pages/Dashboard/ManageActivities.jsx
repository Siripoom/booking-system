import { useEffect, useState } from "react";
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getPlaces,
} from "../../services/apiService";

const ManageActivities = () => {
  const [activities, setActivities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [formData, setFormData] = useState({
    placeId: "",
    name: "",
    maxPeople: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadActivities();
    loadPlaces();
  }, []);

  const loadActivities = async () => {
    const response = await getActivities();
    setActivities(response.data);
  };

  const loadPlaces = async () => {
    const response = await getPlaces();
    setPlaces(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // แปลงค่าเป็น Number
    const formattedData = {
      placeId: Number(formData.placeId),
      name: formData.name,
      maxPeople: Number(formData.maxPeople),
      price: Number(formData.price),
    };
    if (editingId) {
      await updateActivity(editingId, formattedData);
      setEditingId(null);
    } else {
      console.log(formattedData);
      await createActivity(formattedData);
    }
    setFormData({ placeId: "", name: "", maxPeople: "", price: "" });
    loadActivities();
  };

  const handleEdit = (activity) => {
    setFormData({
      placeId: activity.placeId,
      name: activity.name,
      maxPeople: activity.maxPeople,
      price: activity.price,
    });
    setEditingId(activity.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteActivity(id);
      loadActivities();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Manage Activities</h2>

      {/* ฟอร์มเพิ่ม/แก้ไขกิจกรรม */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mt-4">
        <select
          className="select select-bordered"
          value={formData.placeId}
          onChange={(e) =>
            setFormData({ ...formData, placeId: e.target.value })
          }
          required
        >
          <option value="">Select Place</option>
          {places.map((place) => (
            <option key={place.id} value={place.id}>
              {place.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Activity Name"
          className="input input-bordered"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Max People"
          className="input input-bordered"
          value={formData.maxPeople}
          onChange={(e) =>
            setFormData({ ...formData, maxPeople: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Price"
          className="input input-bordered"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <button type="submit" className="btn btn-primary">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* ตารางแสดงข้อมูลกิจกรรม */}
      <table className="table w-full mt-4">
        <thead>
          <tr>
            <th>Place</th>
            <th>Activity Name</th>
            <th>Max People</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td>{activity.place?.name}</td>
              <td>{activity.name}</td>
              <td>{activity.maxPeople}</td>
              <td>${activity.price}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm mx-1"
                  onClick={() => handleEdit(activity)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => handleDelete(activity.id)}
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

export default ManageActivities;
