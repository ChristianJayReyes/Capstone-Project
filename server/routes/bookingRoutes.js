import express from "express";
import { 
  checkAvailabilityAPI, 
  createBooking, 
  getHotelBookings, 
  getUserBookings,
  getAllBookings,        
  updateBookingStatus,
  getBookingLogs,
  exportBookingLogs,
  adminGetCalendarBookings,
  getBookingGroup,
  assignRoomNumbers,
  getAvailableRoomsForBooking,
  sendConfirmationEmail,
  deleteBooking
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', protect, upload.single('idImage'), createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/hotel', protect, getHotelBookings);

// Admin routes
bookingRouter.get('/admin/all', getAllBookings);
bookingRouter.post('/admin/update-status', updateBookingStatus);
bookingRouter.get('/admin/logs', getBookingLogs);
bookingRouter.get('/admin/logs/export', exportBookingLogs);
bookingRouter.get('/admin/calendar', adminGetCalendarBookings);
bookingRouter.get('/admin/group/:booking_id', protect, getBookingGroup);
bookingRouter.post('/admin/assign-rooms', protect, assignRoomNumbers);
bookingRouter.get('/admin/available-rooms', protect, getAvailableRoomsForBooking);
bookingRouter.post('/admin/send-confirmation-email', protect, sendConfirmationEmail);
bookingRouter.delete('/admin/delete', protect, deleteBooking);

export default bookingRouter;