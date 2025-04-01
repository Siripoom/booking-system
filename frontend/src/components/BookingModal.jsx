import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { createBooking, getUserCodes, createUserCode, editUserCode } from "../services/apiService";
import Swal from "sweetalert2";


const BookingModal = ({ date, roomId, onClose, bookingTime }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [peopleCode, setPeopleCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userCodes, setUserCodes] = useState(null);
  const [dataUserCode, setDataUserCode] = useState(null);


  useEffect(() => {
    const fetchUserCodes = async () => {
      try {
        const response = await getUserCodes(localStorage.getItem("userId"));
        console.log(response)
        setDataUserCode(response.data);
        setUserCodes(response.data[0]?.code || null);
        setPeopleCode(response.data[0]?.code || null);
      } catch (error) {
        console.error("Error fetching user codes:", error);
      }
    };
    fetchUserCodes();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBooking = async () => {
    if (!file) {
      setErrorMessage("Please upload a payment slip before booking.");
      return;
    }

    setIsUploading(true);
    setErrorMessage("");

    if (peopleCode === "") {
      setErrorMessage("Please input a user code before booking.");
      return;
    }

    if (userCodes === null) {
      const res = await createUserCode(localStorage.getItem("userId"), { code: peopleCode });
      console.log("res", res);
    }

    if (peopleCode !== userCodes && userCodes !== null) {

      const res = await editUserCode(dataUserCode[0].id , userCodes.id, { code: peopleCode });
      console.log("res", res);
    }


    try {
      // สร้าง FormData สำหรับอัพโหลดไฟล์
      const formData = new FormData();
      formData.append("userId", localStorage.getItem("userId"));
      formData.append("roomId", roomId);
      formData.append("bookingDate", date.toISOString());
      formData.append("status", "PENDING");
      formData.append("paymentSlip", file);
      formData.append("bookingTime", bookingTime);
      formData.append("userCode", peopleCode)
      // ส่งข้อมูลไปที่ Backend
      console.log(formData);
      await createBooking(formData);

      // alert("Booking successful!");
      Swal.fire({
        title: "successful",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
      })
      onClose();
      // window.location.reload();
    } catch (error) {
      console.error("Booking failed:", error);
      setErrorMessage("Failed to create booking. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Booking Details</h2>
        <p>
          Selected Date: <strong>{date.toDateString()}</strong>
        </p>
        <p>
          Selected Room: <strong>Room {roomId}</strong>
        </p>
        <p>
          Bank Account: <strong>SCB </strong>
        </p>
        <label className="block mt-4 font-semibold">Prople Code</label>
        <input
          type="text"
          value={peopleCode || ""}
          className="input input-warning w-full mt-2"
          onChange={(e) => { setPeopleCode(e.target.value) }}
          required
        />

        {/* อัพโหลดไฟล์ */}
        <label className="block mt-4 font-semibold">Upload Payment Slip:</label>
        <input
          type="file"
          className="file-input w-full mt-2"
          onChange={handleFileChange}
          required
        />

        {/* แสดง Error ถ้ามี */}
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

        {/* ปุ่มจอง */}
        <button
          className="btn btn-primary mt-4 w-full"
          onClick={handleBooking}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Confirm Booking"}
        </button>

        {/* ปุ่มยกเลิก */}
        <button className="btn btn-error mt-2 w-full" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};
BookingModal.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  roomId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BookingModal;
