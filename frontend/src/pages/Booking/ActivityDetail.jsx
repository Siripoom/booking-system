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
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingTime, setBookingTime] = useState([]);
  const [time, setTime] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [type, setType] = useState(null);
  const [indexRoom, setIndexRoom] = useState(0);
  const [numberOfPeople, setNumberOfPeople] = useState(0);

  useEffect(() => {
    loadActivity();
    loadRooms();
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      loadBookings();
    }
  }, [rooms]);

  const isSameDate = (date1, date2) => {
    return new Date(date1).toDateString() === new Date(date2).toDateString();
  };

  const loadActivity = async () => {
    const response = await getActivityById(id);
    setActivity(response.data);
  };

  const loadRooms = async () => {
    const response = await getRooms();
    setRooms(response.data.filter((room) => room.activityId === Number(id)));
  };

  const loadBookings = async () => {
    const response = await getBookings();
    const filtered = response.data.filter((booking) =>
      rooms.some((room) => room.id === booking.roomId)
    );
    setBookings(filtered);
  };

  const handleDateChange = async (date) => {
    if (selectedRoom == null) {
      Swal.fire({
        title: "โปรดเลือกห้องก่อนทำการกดเลือกวันที่",
        icon: "error",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }

    setSelectedDate(date);

    const response = await getBookings();
    const filteredBookingTime = response.data.filter(
      (booked) =>
        booked.roomId === selectedRoom && isSameDate(booked.bookingDate, date)
    );

    if (type === "AllDay") {
      // Calculate total number of people booked
      const totalPeopleBooked = filteredBookingTime.reduce((sum, booking) => {
        return sum + booking.numberOfPeople;
      }, 0);
      setNumberOfPeople(totalPeopleBooked);
    } else {
      setBookingTime(filteredBookingTime.map((b) => b.bookingTime));
    }
  };

  const handleRoomSelect = async (roomId, name) => {
    setSelectedRoom(roomId);
    setRoomName(name);
    setTime(null);
    setSelectedDate(null);
    setNumberOfPeople(0); // Reset number of people when room changes

    const response = await getBookings();
    const filtered = response.data.filter((b) => b.roomId === roomId);
    setType(activity.time[0] === "AllDay" ? "AllDay" : "selectTime");
  };

  const openBookingModal = () => {
    if (
      !selectedRoom ||
      !selectedDate ||
      !((type !== "AllDay" && time) || (type === "AllDay" && !time))
    ) {
      Swal.fire({
        title: "โปรดเลือกห้อง วันที่ และเวลา ก่อนทำการจอง",
        icon: "error",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }

    if (type === "AllDay" && numberOfPeople >= activity.maxPeople) {
      Swal.fire({
        title: "ไม่สามารถจองได้",
        text: "ห้องนี้เต็มแล้วในวันนี้",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    setShowModal(true);
  };

  return (
    <div
      className="h-full w-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container mx-auto p-6" style={{ opacity: "0.85" }}>
        {activity && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-3xl font-bold mb-4">{activity.name}</h2>
            <p className="text-lg">
              จำนวนคนสูงสุด: <strong>{activity.maxPeople}</strong>
            </p>
            <p className="text-lg">
              ราคา: <strong>{activity.price} บาท</strong>
            </p>

            {/* ห้อง */}
            <h3 className="text-xl font-semibold mt-6">เลือกห้อง</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <button
                    key={room.id}
                    className={`btn w-full ${
                      selectedRoom === room.id ? "btn-success" : "btn-primary"
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

            {/* เวลา */}
            <div className="flex gap-2 mt-5 justify-center flex-wrap">
              {type === "selectTime" &&
                activity.time.map((slot) => (
                  <button
                    key={slot}
                    disabled={bookingTime.includes(slot)}
                    onClick={() => setTime(slot)}
                    className={`px-4 py-2 rounded ${
                      time === slot
                        ? "bg-yellow-400 text-white"
                        : bookingTime.includes(slot)
                        ? "bg-gray-500 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {slot}
                  </button>
                ))}

              {type === "AllDay" && selectedRoom && selectedDate && (
                <div
                  className={`flex justify-center rounded p-4 text-2xl text-white ${
                    numberOfPeople >= activity.maxPeople
                      ? "bg-red-500"
                      : "bg-gray-500"
                  }`}
                >
                  {`จองแล้ว ${numberOfPeople} / ${activity.maxPeople}`}
                </div>
              )}
            </div>

            {/* ปุ่มจอง */}
            <div className="flex justify-center mt-6">
              <button className="btn btn-success" onClick={openBookingModal}>
                ทำการจอง
              </button>
            </div>

            {/* Modal */}
            {showModal && selectedRoom && selectedDate && (
              <BookingModal
                date={selectedDate}
                roomId={selectedRoom}
                bookingTime={type === "AllDay" ? "AllDay" : time}
                maxPeople={activity.maxPeople}
                roomName={roomName}
                price={activity.price}
                onClose={() => {
                  setShowModal(false);
                  loadBookings();
                }}
              />
            )}

            {/* ตารางการจอง */}
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
                          {rooms.find((r) => r.id === booking.roomId)?.name ||
                            "ไม่ทราบ"}
                        </td>
                        <td className="border p-2">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </td>
                        <td className="border p-2">
                          {booking.bookingTime || "ทั้งวัน"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
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
