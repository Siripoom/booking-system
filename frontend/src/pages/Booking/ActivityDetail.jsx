import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getActivityById,
  getRooms,
  getBookings,
} from "../../services/apiService";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import BookingModal from "../../components/BookingModal";
import Swal from "sweetalert2";
import bg from "../../assets/bg.webp";

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [bookings, setBookings] = useState([]); // ✅ เก็บข้อมูลการจองทั้งหมด
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingTime, setBookingTime] = useState([]);
  const [time, setTime] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [bookingDate, setBookingsDate] = useState([]);

  useEffect(() => {
    loadActivity();
    loadRooms();
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      loadBookedDates();
      loadBookings(); // ✅ โหลดข้อมูลการจอง
    }
  }, [rooms]);

  const loadActivity = async () => {
    const response = await getActivityById(id);
    setActivity(response.data);
  };

  const loadRooms = async () => {
    const response = await getRooms();
    setRooms(response.data.filter((room) => room.activityId === Number(id)));
  };

  const loadBookedDates = async () => {
    const response = await getBookings();
    const filteredBookings = response.data.filter((booking) =>
      rooms.some((room) => room.id === booking.roomId)
    );
    setBookedDates(
      filteredBookings.map((booking) => new Date(booking.bookingDate))
    );
  };

  const loadBookings = async () => {
    const response = await getBookings();
    const filteredBookings = response.data.filter((booking) =>
      rooms.some((room) => room.id === booking.roomId)
    );
    setBookings(filteredBookings); // ✅ บันทึกข้อมูลการจองทั้งหมด
  };

  const handleDateChange = async (date) => {
    if (selectedRoom == null) {
      Swal.fire({
        title: "โปรดเลือกห้องก่อนทำการกดเลือกวันที่",
        icon: "error",
        showConfirmButton: false,
        timer: 1000,
      });
    } else {
      setSelectedDate(date);
      const localDate = new Date(date);
      const isoString = localDate.toISOString(); // แปลงเป็นรูปแบบ UTC

      const response = await getBookings();
      const filteredBookingTime = response.data.filter(
        (booked) =>
          selectedRoom === booked.roomId && booked.bookingDate === isoString // ต้อง return true หรือ false
      );
      let bookedTime = [];

      filteredBookingTime.forEach((data) => {
        bookedTime.push(data.bookingTime);
      });
      setBookingTime(bookedTime);
    }
  };

  const handleRoomSelect = async (roomId, roomName) => {
    setSelectedRoom(roomId);
    setRoomName(roomName);
    const response = await getBookings();
    const filteredBookingDate = response.data.filter(
      (booked) => selectedRoom === booked.roomId // ต้อง return true หรือ false
    );
    setBookingsDate(filteredBookingDate);
    // activity.time
  };

  const openBookingModal = () => {
    if (!selectedRoom || !selectedDate || !time) {
      Swal.fire({
        title: "โปรดเลือกห้อง วันที่ และเวลา ก่อนทำการจอง",
        icon: "error",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    setShowModal(true);
  };

  return (
    <div
      className=" h-full w-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover", // ปรับให้เต็มพื้นที่
        backgroundPosition: "center", // จัดให้อยู่กึ่งกลาง
        backgroundRepeat: "no-repeat", // ป้องกันการซ้ำของภาพ
      }}
    >
      <div
        className="container mx-auto p-6"
        style={{
          opacity: "0.80",
        }}
      >
        {activity && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-3xl font-bold mb-4">{activity.name}</h2>
            <p className="text-lg">
              จำนวนคนสูงสุด: <strong>{activity.maxPeople}</strong>
            </p>
            <p className="text-lg">
              ราคา: <strong>${activity.price}</strong>
            </p>

            {/* รายการห้อง */}
            <h3 className="text-xl font-semibold mt-6">เลือกห้อง</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <button
                    key={room.id}
                    className={`btn w-full ${
                      selectedRoom == room.id ? "btn-success" : "btn-primary"
                    }`}
                    onClick={() => handleRoomSelect(room.id, room.name)}
                  >
                    {room.name}
                  </button>
                ))
              ) : (
                <p className="text-red-500">ไม่มีห้องว่าง</p>
              )}
            </div>

            {/* ปฏิทิน */}
            <h3 className="text-xl font-semibold mt-6">
              เลือกวันที่เพื่อทำการจอง
            </h3>
            <div className="flex justify-center mt-4">
              <Calendar onChange={handleDateChange} value={selectedDate} />
            </div>

            <div className="flex gap-2 mt-5 justify-center">
              {activity.time.map((data) => (
                <button
                  key={data}
                  disabled={bookingTime.includes(data)} // ถ้ามีใน bookingTime ให้กดไม่ได้
                  onClick={() => {
                    setTime(data);
                  }}
                  className={`px-3 py-2 rounded ${
                    time === data
                      ? "bg-yellow-400 text-white" // ถ้าถูกเลือก หรือจองไปแล้ว ให้เป็นสีเทา
                      : bookingTime.includes(data)
                      ? "bg-gray-500 text-white"
                      : "bg-green-600 text-white" // ถ้ายังไม่ได้เลือก ให้เป็นสีน้ำเงิน
                  }`}
                >
                  {data}
                </button>
              ))}
            </div>

            {/* ปุ่มจอง */}
            <div className="flex justify-center mt-6">
              <button className="btn btn-success" onClick={openBookingModal}>
                ทำการจอง
              </button>
            </div>

            {/* Modal จองห้อง */}
            {showModal && selectedRoom && selectedDate && (
              <BookingModal
                date={selectedDate}
                roomId={selectedRoom}
                bookingTime={time}
                maxPeople={activity.maxPeople}
                roomName={roomName}
                price={activity.price}
                onClose={() => {
                  setShowModal(false);
                  loadBookings(); // ✅ รีโหลดข้อมูลการจองเมื่อจองเสร็จ
                }}
              />
            )}

            {/* รายการจองที่มีอยู่ */}
            <h3 className="text-xl font-semibold mt-8">รายการจองที่มีอยู่</h3>
            <div className="overflow-x-auto mt-4">
              <table className="table w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">สถานที่</th>
                    <th className="border p-2">วันที่จอง</th>
                    <th className="border p-2">เวลาที่จอง</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="border p-2">
                          {rooms.find((room) => room.id === booking.roomId)
                            ?.name || "ไม่ทราบ"}
                        </td>
                        <td className="border p-2">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </td>
                        <td className="border p-2">{booking.bookingTime} น.</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="border p-2 text-center text-gray-500"
                      >
                        ไม่มีรายการจอง
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityDetail;
