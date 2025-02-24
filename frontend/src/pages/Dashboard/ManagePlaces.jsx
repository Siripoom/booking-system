import { useEffect, useState } from "react";
import {
  getPlaces,
  createPlace,
  updatePlace,
  deletePlace,
} from "../../services/apiService";

const ManagePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    const response = await getPlaces();
    setPlaces(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updatePlace(editingId, formData);
      setEditingId(null);
    } else {
      await createPlace(formData);
    }
    setFormData({ name: "", description: "" });
    loadPlaces();
  };

  const handleEdit = (place) => {
    setFormData({
      name: place.name,
      description: place.description,
    });
    setEditingId(place.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deletePlace(id);
      loadPlaces();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Manage Places</h2>

      {/* ฟอร์มเพิ่ม/แก้ไขสถานที่ */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mt-4">
        <input
          type="text"
          placeholder="Place Name"
          className="input input-bordered"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="input input-bordered"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
        <button type="submit" className="btn btn-primary">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* ตารางแสดงข้อมูลสถานที่ */}
      <table className="table w-full mt-4">
        <thead>
          <tr>
            <th>Place Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {places.map((place) => (
            <tr key={place.id}>
              <td>{place.name}</td>
              <td>{place.description}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm mx-1"
                  onClick={() => handleEdit(place)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => handleDelete(place.id)}
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

export default ManagePlaces;
