import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  createBooking,
  getUserCodes,
  createUserCode,
  editUserCode,
} from "../services/apiService";
import Swal from "sweetalert2";

const BookingModal = ({
  date,
  roomId,
  onClose,
  bookingTime,
  price,
  maxPeople,
  roomName,
}) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [peopleCode, setPeopleCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [userCodes, setUserCodes] = useState(null);
  const [dataUserCode, setDataUserCode] = useState(null);

  useEffect(() => {
    const fetchUserCodes = async () => {
      try {
        const response = await getUserCodes(localStorage.getItem("userId"));
        const fetchedCode = response?.data?.[0]?.code || "";
        setDataUserCode(response.data || []);
        setUserCodes(fetchedCode);
        setPeopleCode(fetchedCode);
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
      setErrorMessage("กรุณาอัปโหลดสลิปการชำระเงินก่อนทำการจอง");
      return;
    }

    if (numberOfPeople > maxPeople) {
      setErrorMessage(`จำนวนคนต้องไม่เกิน ${maxPeople} คน`);
      return;
    }

   
    setIsUploading(true);
    setErrorMessage("");

    try {
      // สร้างหรืออัปเดตรหัสผู้ใช้
     

      // แปลงวันที่
      const localDate = new Date(date);
      localDate.setHours(0, 0, 0, 0);

      const formData = new FormData();
      formData.append("userId", localStorage.getItem("userId"));
      formData.append("roomId", roomId);
      formData.append("bookingDate", localDate.toISOString());
      formData.append("status", "PENDING");
      formData.append("paymentSlip", file);
      formData.append("bookingTime", bookingTime);
      formData.append("numberOfPeople", numberOfPeople);
      formData.append("totalPrice", price * numberOfPeople);
      // formData.append("userCode", peopleCode);

      await createBooking(formData);

      Swal.fire({
        title: "การจองสำเร็จ",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

      onClose();
    } catch (error) {
      console.error("การจองล้มเหลว:", error);
      setErrorMessage("ไม่สามารถสร้างการจองได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsUploading(false);
    }
  };

  const totalPrice = price * numberOfPeople;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">รายละเอียดการจอง</h2>
        <p>
          วันที่เลือก: <strong>{date.toDateString()}</strong>
        </p>
        <p>
          สถานที่เลือก: <strong>{roomName}</strong>
        </p>
        <p>
          จำนวนคนสูงสุด:{" "}
          <strong>{maxPeople === 0 ? "ไม่จำกัด" : `${maxPeople} คน`}</strong>
        </p>
        <p>
          ราคา: <strong>{price} บาท</strong>
        </p>
        <p>
          <strong>ราคารวม: {totalPrice} บาท</strong>
        </p>

        {/* <label className="block mt-4 font-semibold">People Code</label>
        <input
          type="text"
          value={peopleCode}
          onChange={(e) => setPeopleCode(e.target.value)}
          className="input input-warning w-full mt-2"
          required
        /> */}

        <label className="block mt-4 font-semibold">จำนวนคน:</label>
        <input
          type="number"
          min="1"
          max={maxPeople}
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(Number(e.target.value))}
          className="input input-bordered w-full mt-2"
        />

        <label className="block mt-4 font-semibold">
          อัปโหลดสลิปการชำระเงิน:
        </label>
        <input
          type="file"
          className="file-input w-full mt-2"
          onChange={handleFileChange}
          required
        />

        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

        <button
          className="btn btn-primary mt-4 w-full"
          onClick={handleBooking}
          disabled={isUploading}
        >
          {isUploading ? "กำลังอัปโหลด..." : "ยืนยันการจอง"}
        </button>

        <button className="btn btn-error mt-2 w-full" onClick={onClose}>
          ยกเลิก
        </button>
      </div>
    </div>
  );
};

BookingModal.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  roomId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  bookingTime: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  maxPeople: PropTypes.number.isRequired,
  roomName: PropTypes.string.isRequired,
};

export default BookingModal;
