import { useState } from "react";
import PropTypes from "prop-types";
import { createBooking } from "../services/apiService";
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
  const [errorMessage, setErrorMessage] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1); // จำนวนคน

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
      // แปลงวันที่ที่เลือกเป็น UTC โดยตั้งเวลาเป็น 00:00:00 เพื่อหลีกเลี่ยงการแปลงเขตเวลา
      const localDate = new Date(date);
      localDate.setHours(0, 0, 0, 0); // ตั้งเวลาเป็นเวลาเริ่มต้นของวัน

      const formData = new FormData();
      formData.append("userId", localStorage.getItem("userId"));
      formData.append("roomId", roomId);
      formData.append("bookingDate", localDate.toISOString()); // ใช้วันที่ที่แปลงแล้ว
      formData.append("status", "PENDING");
      formData.append("paymentSlip", file);
      formData.append("bookingTime", bookingTime);
      formData.append("numberOfPeople", numberOfPeople); // เพิ่มจำนวนคน
      formData.append("totalPrice", price * numberOfPeople); // คำนวณราคาทั้งหมด

      await createBooking(formData);
      // แจ้งเตือนการจองสำเร็จ
      Swal.fire({
        title: "การจองสำเร็จ",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("การจองล้มเหลว:", error);
      setErrorMessage("ไม่สามารถสร้างการจองได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsUploading(false);
    }
  };

  // คำนวณราคาทั้งหมด
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

        {/* ฟอร์มเลือกจำนวนคน */}
        <label className="block mt-4 font-semibold">จำนวนคน:</label>
        <input
          type="number"
          min="1"
          max={maxPeople}
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(e.target.value)}
          className="input input-bordered w-full mt-2"
        />

        {/* อัปโหลดไฟล์ */}
        <label className="block mt-4 font-semibold">
          อัปโหลดสลิปการชำระเงิน:
        </label>
        <input
          type="file"
          className="file-input w-full mt-2"
          onChange={handleFileChange}
          required
        />

        {/* แสดงข้อผิดพลาด */}
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

        {/* ปุ่มยืนยันการจอง */}
        <button
          className="btn btn-primary mt-4 w-full"
          onClick={handleBooking}
          disabled={isUploading}
        >
          {isUploading ? "กำลังอัปโหลด..." : "ยืนยันการจอง"}
        </button>

        {/* ปุ่มยกเลิก */}
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
  price: PropTypes.number.isRequired, // รับค่า price จาก props
  maxPeople: PropTypes.number.isRequired, // รับค่า maxPeople จาก props
  roomName: PropTypes.string.isRequired,
};

export default BookingModal;
