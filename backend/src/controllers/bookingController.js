const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// 🔹 ดึงการจองทั้งหมด// 🔹 สร้างการจองใหม่ พร้อมอัพโหลดไฟล์
exports.createBooking = async (req, res) => {
  try {
    const {
      userId,
      roomId,
      bookingDate,
      status,
      bookingTime,
      numberOfPeople,
      totalPrice,
    } = req.body;

    let paymentSlip = null;
    console.log("req.body", req.body);
    // ตรวจสอบว่ามีไฟล์แนบหรือไม่
    if (req.file) {
      paymentSlip = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ error: "Payment slip is required!" });
    }

    const newBooking = await prisma.booking.create({
      data: {
        userId,
        roomId: Number(roomId),
        bookingDate: new Date(bookingDate),
        status: status || "PENDING",
        paymentSlip,
        bookingTime,
        numberOfPeople: Number(numberOfPeople),
        totalPrice: Number(totalPrice),
      },
    });

    res
      .status(201)
      .json({ message: "Booking successful!", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

// 🔹 ดึงข้อมูลการจองทั้งหมด
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// 🔹 ดึงข้อมูลการจองตาม ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: true, room: { include: { activity: true } } },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking" });
  }
};

// 🔹 อัปเดตข้อมูลการจอง
exports.updateBooking = async (req, res) => {
  try {
    const { roomId, bookingDate, status } = req.body;

    // ตรวจสอบว่าห้องมีอยู่จริงหรือไม่
    if (roomId) {
      const roomExists = await prisma.room.findUnique({
        where: { id: parseInt(roomId) },
      });
      if (!roomExists) return res.status(400).json({ error: "Room not found" });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(req.params.id) },
      data: {
        roomId: roomId ? parseInt(roomId) : undefined,
        bookingDate: bookingDate ? new Date(bookingDate) : undefined,
        status,
      },
    });

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: "Failed to update booking" });
  }
};

// 🔹 ลบการจอง
exports.deleteBooking = async (req, res) => {
  try {
    await prisma.booking.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
};
