import express from "express";
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";
import upload from "../middlewares/uploadMiddleware.js";
const router = express.Router();

router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.post("/", upload.single("paymentSlip"), createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;
