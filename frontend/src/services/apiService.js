import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================= Authentication APIs =======================

// ✅ ลงทะเบียนผู้ใช้
export const registerUser = (userData) => api.post("/auth/register", userData);

// ✅ เข้าสู่ระบบ
export const loginUser = (credentials) => api.post("/auth/login", credentials);

// ✅ ดึงข้อมูลผู้ใช้จาก JWT Token
export const getUserProfile = (token) =>
  api.get("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

// ======================= User APIs =======================
export const getUsers = () => api.get("/users");
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post("/users", userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// ======================= Place APIs =======================
export const getPlaces = () => api.get("/places");
export const getPlaceById = (id) => api.get(`/places/${id}`);
export const createPlace = (placeData) => api.post("/places", placeData);
export const updatePlace = (id, placeData) =>
  api.put(`/places/${id}`, placeData);
export const deletePlace = (id) => api.delete(`/places/${id}`);

// ======================= Activity APIs =======================
export const getActivities = () => api.get("/activities");
export const getActivityById = (id) => api.get(`/activities/${id}`);
export const createActivity = (activityData) =>
  api.post("/activities", activityData);
export const updateActivity = (id, activityData) =>
  api.put(`/activities/${id}`, activityData);
export const deleteActivity = (id) => api.delete(`/activities/${id}`);

// ======================= Room APIs =======================
export const getRooms = () => api.get("/rooms");
export const getRoomById = (id) => api.get(`/rooms/${id}`);
export const createRoom = (roomData) => api.post("/rooms", roomData);
export const updateRoom = (id, roomData) => api.put(`/rooms/${id}`, roomData);
export const deleteRoom = (id) => api.delete(`/rooms/${id}`);

// ======================= Booking APIs =======================
export const getBookings = () => api.get("/bookings");
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const createBooking = (bookingData) =>
  api.post("/bookings", bookingData);
export const updateBooking = (id, bookingData) =>
  api.put(`/bookings/${id}`, bookingData);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

export default api;
