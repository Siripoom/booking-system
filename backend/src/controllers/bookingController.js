const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// 🔹 ดึงการจองทั้งหมด
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { user: true, room: { include: { activity: true } } }, // รวมข้อมูลผู้ใช้, ห้อง และกิจกรรม
    });
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

// 🔹 สร้างการจองใหม่
exports.createBooking = async (req, res) => {
  try {
    const { userId, roomId, bookingDate, status } = req.body;

    // ตรวจสอบว่าผู้ใช้มีอยู่จริงหรือไม่
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) return res.status(400).json({ error: "User not found" });

    // ตรวจสอบว่าห้องมีอยู่จริงหรือไม่
    const roomExists = await prisma.room.findUnique({
      where: { id: parseInt(roomId) },
    });
    if (!roomExists) return res.status(400).json({ error: "Room not found" });

    const newBooking = await prisma.booking.create({
      data: {
        userId,
        roomId: parseInt(roomId),
        bookingDate: new Date(bookingDate),
        status: status || "PENDING",
      },
    });

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: "Failed to create booking" });
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
