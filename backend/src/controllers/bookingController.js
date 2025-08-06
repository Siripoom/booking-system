const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Helper function to normalize dates to UTC
const normalizeDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ));
};

// Helper to format dates for frontend (YYYY-MM-DD)
const formatDateForFrontend = (date) => {
  if (!date) return null;
  try {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return null;
  }
};

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { userId, roomId, bookingDate } = req.body;
    if (!userId || !roomId || !bookingDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const bookingData = {
      userId,
      roomId: parseInt(roomId),
      bookingDate: normalizeDate(bookingDate),
      status: req.body.status || "PENDING",
      paymentSlip: req.file ? `/uploads/${req.file.filename}` : null,
      bookingTime: req.body.bookingTime || "12:00",
      numberOfPeople: req.body.numberOfPeople ? parseInt(req.body.numberOfPeople) : 1,
      totalPrice: req.body.totalPrice ? parseFloat(req.body.totalPrice) : 0
    };

    const newBooking = await prisma.booking.create({ data: bookingData });

    res.status(201).json({
      success: true,
      booking: {
        ...newBooking,
        bookingDate: formatDateForFrontend(newBooking.bookingDate)
      }
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        room: { include: { activity: true } }
      },
      orderBy: { bookingDate: 'desc' }
    });

    const formattedBookings = bookings.map(booking => ({
      ...booking,
      bookingDate: formatDateForFrontend(booking.bookingDate),
      createdAt: formatDateForFrontend(booking.createdAt),
      updatedAt: formatDateForFrontend(booking.updatedAt)
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: true, room: { include: { activity: true } } }
    });

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.json({
      ...booking,
      bookingDate: formatDateForFrontend(booking.bookingDate)
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      bookingDate: req.body.bookingDate ? normalizeDate(req.body.bookingDate) : undefined,
      roomId: req.body.roomId ? parseInt(req.body.roomId) : undefined
    };

    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });

    res.json({
      success: true,
      booking: {
        ...updatedBooking,
        bookingDate: formatDateForFrontend(updatedBooking.bookingDate)
      }
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Failed to update booking" });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    await prisma.booking.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Failed to delete booking" });
  }
};