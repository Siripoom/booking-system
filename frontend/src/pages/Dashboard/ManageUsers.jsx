import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/apiService";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // เพิ่มตัวแปรสำหรับเก็บข้อมูลที่กรอง
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [searchName, setSearchName] = useState(""); // เพิ่มตัวแปรสำหรับคำค้นหา

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.fullName.toLowerCase().includes(searchName.toLowerCase())
      )
    );
  }, [searchName, users]);

  const loadUsers = async () => {
    const response = await getUsers();
    setUsers(response.data);
    setFilteredUsers(response.data); // ตั้งค่าเริ่มต้นให้ filteredUsers เป็นข้อมูลทั้งหมด
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (editingUser) {
      await updateUser(editingUser.id, formData);
    } else {
      await createUser(formData);
    }
    setEditingUser(null);
    setFormData({ fullName: "", email: "", password: "", role: "USER" });
    loadUsers();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: user.password,
      role: user.role,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteUser(id);
      loadUsers();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Manage Users</h2>

      {/* เพิ่มกล่องค้นหาชื่อ */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="input input-bordered w-full mb-2"
        />
      </div>

      <form onSubmit={handleCreateOrUpdate} className="mt-4">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.fullName}
          className="input input-bordered w-full mb-2"
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          className="input input-bordered w-full mb-2"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          className="input input-bordered w-full mb-2"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <select
          className="select select-bordered w-full mb-2"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit" className="btn btn-primary w-full">
          {editingUser ? "Update" : "Create"} User
        </button>
      </form>

      {/* ตารางแสดงผลผู้ใช้ */}
      <table className="table w-full mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm mr-2"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border p-2 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
