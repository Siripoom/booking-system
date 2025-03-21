import { useEffect, useState } from "react";
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getPlaces,
} from "../../services/apiService";
import Swal from 'sweetalert2'

const ManageActivities = () => {
  const [activities, setActivities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    placeId: "",
    name: "",
    maxPeople: "",
    price: "",
    time: []
  });
  const [time, setTime] = useState([])
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadActivities();
    loadPlaces();
  }, []);

  useEffect(() => {
    console.log(time)
  }, [time])

  const allowedTimes = ['AllDay', '09.00-10.00', '10.00-11.00', '11.00-12.00', '12.00-13.00', '13.00-14.00', '14.00-15.00', '15.00-16.00', '16.00-17.00', '17.00-18.00', '18.00-19.00', '19.00-20.00', '20.00-21.00'];

  const loadActivities = async () => {
    const response = await getActivities();
    setActivities(response.data);
    setTime
  };

  const loadPlaces = async () => {
    const response = await getPlaces();
    setPlaces(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (time.length == 0) {
      Swal.fire({
        title: "โปรดเลือกเวลาที่เปิด",
        icon: "error",
        timer: 1500,
        showConfirmButton: false
      })
      return
    }
    const formattedData = {
      placeId: Number(formData.placeId),
      name: formData.name,
      maxPeople: Number(formData.maxPeople),
      price: Number(formData.price),
      time: time
    };

    console.log(formattedData)
    if (editingId) {
      await updateActivity(editingId, formattedData);
      setEditingId(null);
      setTime([])
      Swal.fire({
        title: "แก้ไขกิจกรรมเสร็จสิ้น",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      })
    } else {
      console.log(formattedData);
      await createActivity(formattedData);
      setTime([])
      Swal.fire({
        title: "แก้ไขกิจกรรมเสร็จสิ้น",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      })
    }
    setFormData({ placeId: "", name: "", maxPeople: "", price: "", time: [] });
    loadActivities();

  };

  const handleEdit = (activity) => {
    setFormData({
      placeId: activity.placeId,
      name: activity.name,
      maxPeople: activity.maxPeople,
      price: activity.price,
      time: activity.time,
    });
    setTime(activity.time)
    setEditingId(activity.id);
  };
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "หากลบแล้วจะไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      await deleteActivity(id);
      loadActivities();
      Swal.fire("ลบสำเร็จ!", "กิจกรรมของคุณถูกลบแล้ว", "success");
    }
  };

  const removeTime = (indexToRemove) => {
    setTime(time.filter((_, index) => index !== indexToRemove)); // ลบค่าตาม index
  };
  const setTimer = (e) => {
    const newTime = e.target.value;
  
    if (newTime == "จองรายคน") {
      setTime(["จองรายวัน"]); // ล้างทั้งหมด และเพิ่ม "จองรายวัน" เท่านั้น
      setSelectedTime(""); // รีเซ็ตค่า select
    } else {
      setTime((prevTimes) => {
        // ถ้ามี "จองรายวัน" ให้ลบออกก่อน
        const filteredTimes = prevTimes.filter((t) => t !== "จองรายวัน");
  
        // ตรวจสอบว่ามีค่าซ้ำหรือไม่
        const isDuplicate = filteredTimes.includes(newTime);
        if (isDuplicate) {
          Swal.fire({
            title: "เลือกเวลาซ้ำ",
            icon: "error",
            timer: 1000,
            showConfirmButton: false
          });
          return filteredTimes; // คืนค่าของเดิม (ไม่เพิ่ม)
        }
  
        return [...filteredTimes, newTime]; // เพิ่มค่าใหม่เข้าไป
      });
  
      setSelectedTime(""); // รีเซ็ตค่า select
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

        <select onChange={setTimer} value={selectedTime}>
          <option value="" disabled>เลือกเวลา</option>
          {allowedTimes.map((time, index) => (
            <option key={index} value={time}>{time=="AllDay"?"จองรายวัน":time}</option>
          ))}
        </select>

        <button type="submit" className="btn btn-primary">
          {editingId ? "Update" : "Add"}
        </button>
      </form>
      <div className="my-3 flex flex-wrap gap-2">
        {time && time.map((data, index) => (
          <span key={index} className="rounded-lg bg-white px-2 py-2 bg-gray-200">
            {data=="AllDay"?"จองรายวัน":data}{" "}
            <button
              className="ms-2 bg-red-500 text-white px-1 rounded"
              onClick={() => removeTime(index)}
            >
              X
            </button>
          </span>
        ))}
      </div>


      <hr />

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
