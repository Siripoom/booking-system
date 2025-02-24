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

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [bookings, setBookings] = useState([]); // ✅ เก็บข้อมูลการจองทั้งหมด
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
  };

  const openBookingModal = () => {
    if (!selectedRoom || !selectedDate) {
      alert("Please select a room and a date before booking.");
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="container mx-auto p-6">
      {activity && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-4">{activity.name}</h2>
          <p className="text-lg">
            Max People: <strong>{activity.maxPeople}</strong>
          </p>
          <p className="text-lg">
            Price: <strong>${activity.price}</strong>
          </p>

          {/* รายการห้อง */}
          <h3 className="text-xl font-semibold mt-6">Select a Room</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <button
                  key={room.id}
                  className={`btn w-full ${
                    selectedRoom === room.id ? "btn-success" : "btn-primary"
                  }`}
                  onClick={() => handleRoomSelect(room.id)}
                >
                  {room.name}
                </button>
              ))
            ) : (
              <p className="text-red-500">No rooms available.</p>
            )}
          </div>

          {/* ปฏิทิน */}
          <h3 className="text-xl font-semibold mt-6">Select Date to Book</h3>
          <div className="flex justify-center mt-4">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileDisabled={({ date }) =>
                bookedDates.some(
                  (bookedDate) =>
                    bookedDate.toDateString() === date.toDateString()
                )
              }
            />
          </div>

          {/* ปุ่มจอง */}
          <div className="flex justify-center mt-6">
            <button className="btn btn-success" onClick={openBookingModal}>
              Proceed to Booking
            </button>
          </div>

          {/* Modal จองห้อง */}
          {showModal && selectedRoom && selectedDate && (
            <BookingModal
              date={selectedDate}
              roomId={selectedRoom}
              onClose={() => {
                setShowModal(false);
                loadBookings(); // ✅ รีโหลดข้อมูลการจองเมื่อจองเสร็จ
              }}
            />
          )}

          {/* รายการจองที่มีอยู่ */}
          <h3 className="text-xl font-semibold mt-8">Existing Bookings</h3>
          <div className="overflow-x-auto mt-4">
            <table className="table w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Room</th>
                  <th className="border p-2">Booking Date</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Payment Slip</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="border p-2">
                        {rooms.find((room) => room.id === booking.roomId)
                          ?.name || "Unknown"}
                      </td>
                      <td className="border p-2">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </td>
                      <td
                        className={`border p-2 ${
                          booking.status === "CONFIRMED"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {booking.status}
                      </td>
                      <td className="border p-2">
                        {booking.paymentSlip ? (
                          <a
                            href={`http://localhost:5000${booking.paymentSlip}`}
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="border p-2 text-center text-gray-500"
                    >
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityDetail;
